// Vendor Services - Combined search and scrape functionality
import { searchVendorProducts, searchSupportHardware, TavilySearchResult } from "./tavily";
import { scrapeProductPage, ProductDetails, isFirecrawlConfigured } from "./firecrawl";
import { prisma } from "@/lib/db";

export interface VendorProduct {
  id?: string;
  vendor: string;
  productName: string;
  partNumber?: string;
  productUrl: string;
  datasheetUrl?: string;
  imageUrl?: string;
  description?: string;
  specifications?: Record<string, string>;
  isPreferred: boolean;
  cached: boolean;
}

export interface VendorSearchResult {
  success: boolean;
  products: VendorProduct[];
  fromCache: boolean;
  error?: string;
}

// Preferred vendor order
const VENDOR_PRIORITY: Record<string, number> = {
  "Georg Fischer": 1,
  "GF Piping Systems": 1,
  "Spears Manufacturing": 2,
  "NIBCO": 3,
  "Charlotte Pipe": 4,
  "Anvil International": 5,
  "Victaulic": 6,
  "Swagelok": 2,
  "Mueller": 3,
};

/**
 * Find vendor products for a specific material and size
 * First checks cache, then searches and scrapes if needed
 */
export async function findVendorProducts(
  material: string,
  pipeSize: string,
  options: {
    useCache?: boolean;
    scrapeDetails?: boolean;
    limit?: number;
  } = {}
): Promise<VendorSearchResult> {
  const { useCache = true, scrapeDetails = true, limit = 5 } = options;

  // Check cache first
  if (useCache) {
    const cached = await prisma.vendorProduct.findMany({
      where: {
        material: { contains: material, mode: "insensitive" },
        pipeSize: pipeSize,
      },
      take: limit,
      orderBy: { isPreferred: "desc" },
    });

    if (cached.length > 0) {
      return {
        success: true,
        products: cached.map((p) => ({
          id: p.id,
          vendor: p.vendor,
          productName: p.productName || "",
          partNumber: p.modelNumber || undefined,
          productUrl: p.productUrl || "",
          datasheetUrl: p.datasheetUrl || undefined,
          imageUrl: p.imageUrl || undefined,
          specifications: p.specifications as Record<string, string> | undefined,
          isPreferred: p.isPreferred,
          cached: true,
        })),
        fromCache: true,
      };
    }
  }

  // Search with Tavily
  const searchResult = await searchVendorProducts(material, pipeSize);

  if (!searchResult.success || searchResult.results.length === 0) {
    return {
      success: false,
      products: [],
      fromCache: false,
      error: searchResult.error || "No products found",
    };
  }

  // Process search results
  const products: VendorProduct[] = [];
  const urlsToScrape: string[] = [];

  // Filter and deduplicate results
  const seenVendors = new Set<string>();
  const relevantResults = searchResult.results
    .filter((r) => r.score > 0.5)
    .slice(0, limit * 2);

  for (const result of relevantResults) {
    const vendor = detectVendor(result.url, result.title);
    if (!vendor || seenVendors.has(vendor)) continue;
    seenVendors.add(vendor);

    const product: VendorProduct = {
      vendor,
      productName: cleanProductName(result.title),
      productUrl: result.url,
      description: result.content,
      isPreferred: (VENDOR_PRIORITY[vendor] || 99) <= 3,
      cached: false,
    };

    products.push(product);

    if (scrapeDetails && isFirecrawlConfigured()) {
      urlsToScrape.push(result.url);
    }
  }

  // Scrape additional details if configured
  if (urlsToScrape.length > 0 && scrapeDetails) {
    for (const url of urlsToScrape.slice(0, 3)) {
      const scrapeResult = await scrapeProductPage(url);
      if (scrapeResult.success && scrapeResult.product) {
        const productIndex = products.findIndex((p) => p.productUrl === url);
        if (productIndex >= 0) {
          products[productIndex] = {
            ...products[productIndex],
            partNumber: scrapeResult.product.partNumber,
            datasheetUrl: scrapeResult.product.datasheetUrl,
            imageUrl: scrapeResult.product.imageUrl,
            specifications: scrapeResult.product.specifications,
          };
        }
      }
    }
  }

  // Sort by vendor priority
  products.sort((a, b) => {
    const priorityA = VENDOR_PRIORITY[a.vendor] || 99;
    const priorityB = VENDOR_PRIORITY[b.vendor] || 99;
    return priorityA - priorityB;
  });

  // Cache the results
  for (const product of products.slice(0, limit)) {
    try {
      await prisma.vendorProduct.create({
        data: {
          vendor: product.vendor,
          productName: product.productName,
          modelNumber: product.partNumber,
          productUrl: product.productUrl,
          datasheetUrl: product.datasheetUrl,
          imageUrl: product.imageUrl,
          specifications: product.specifications || {},
          material,
          pipeSize,
          isPreferred: product.isPreferred,
        },
      });
    } catch (error) {
      // Ignore duplicate errors
      console.log("Cache write skipped (may be duplicate)");
    }
  }

  return {
    success: true,
    products: products.slice(0, limit),
    fromCache: false,
  };
}

/**
 * Find support hardware products
 */
export async function findSupportHardware(
  materialType: "plastic" | "metal",
  supportType: string,
  pipeSize: string
): Promise<VendorSearchResult> {
  const searchResult = await searchSupportHardware(materialType, supportType, pipeSize);

  if (!searchResult.success) {
    return {
      success: false,
      products: [],
      fromCache: false,
      error: searchResult.error,
    };
  }

  const products: VendorProduct[] = searchResult.results
    .filter((r) => r.score > 0.4)
    .slice(0, 5)
    .map((result) => ({
      vendor: detectVendor(result.url, result.title) || "Unknown",
      productName: cleanProductName(result.title),
      productUrl: result.url,
      description: result.content,
      isPreferred: result.url.includes("gfps.com") || result.url.includes("georgfischer"),
      cached: false,
    }));

  return {
    success: true,
    products,
    fromCache: false,
  };
}

/**
 * Detect vendor from URL or title
 */
function detectVendor(url: string, title: string): string | null {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();
  const combined = urlLower + " " + titleLower;

  if (combined.includes("gfps") || combined.includes("georgfischer") || combined.includes("georg fischer")) {
    return "Georg Fischer";
  }
  if (combined.includes("spears")) return "Spears Manufacturing";
  if (combined.includes("nibco")) return "NIBCO";
  if (combined.includes("charlottepipe") || combined.includes("charlotte pipe")) return "Charlotte Pipe";
  if (combined.includes("anvil")) return "Anvil International";
  if (combined.includes("victaulic")) return "Victaulic";
  if (combined.includes("swagelok")) return "Swagelok";
  if (combined.includes("mueller")) return "Mueller";
  if (combined.includes("phd")) return "PHD Manufacturing";
  if (combined.includes("cooper") || combined.includes("b-line")) return "Cooper B-Line";
  if (combined.includes("unistrut")) return "Unistrut";

  return null;
}

/**
 * Clean product name from search result title
 */
function cleanProductName(title: string): string {
  return title
    .replace(/\s*[-|]\s*.*?(\.com|systems?|manufacturing|inc\.?|corp\.?|international).*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Re-export types
export type { TavilySearchResult, ProductDetails };
export { isFirecrawlConfigured };
