// Enhanced Hardware Search Service
// Searches for specific products and scrapes real product details with images
// Includes caching layer to avoid redundant API calls

import { scrapeProductPage, ProductDetails } from "./firecrawl";
import { prisma } from "@/lib/db";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_API_URL = "https://api.tavily.com/search";

// Cache TTL: 60 days in milliseconds
const CACHE_TTL_MS = 60 * 24 * 60 * 60 * 1000;

export interface HardwareProduct {
  vendor: string;
  productName: string;
  partNumber?: string;
  productUrl: string;
  imageUrl?: string;
  datasheetUrl?: string;
  assemblyDrawing?: string;
  description?: string;
  specifications?: Record<string, string>;
  isPreferred: boolean;
  searchConfidence: number;
}

export interface HardwareSearchResult {
  success: boolean;
  products: HardwareProduct[];
  searchQuery?: string;
  error?: string;
  fromCache?: boolean;
}

// Product search configurations for different support types
const PRODUCT_SEARCH_CONFIG = {
  plastic: {
    hanger: {
      queries: [
        "Georg Fischer Stress Less clevis hanger pipe support",
        "GF piping systems plastic pipe hanger kit",
      ],
      preferredVendor: "Georg Fischer",
      fallbackProducts: [{
        vendor: "Georg Fischer",
        productName: "Stress Less Clevis Hanger Kit",
        productUrl: "https://www.gfps.com/us/en/products/piping-systems/industrial/stress-less.html",
        assemblyDrawing: "HGR-1",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
    guide: {
      queries: [
        "Georg Fischer Stress Less pipe guide plastic",
        "GF piping systems pipe guide support",
      ],
      preferredVendor: "Georg Fischer",
      fallbackProducts: [{
        vendor: "Georg Fischer",
        productName: "Stress Less Pipe Guide",
        productUrl: "https://www.gfps.com/us/en/products/piping-systems/industrial/stress-less.html",
        assemblyDrawing: "GDE-1",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
    anchor: {
      queries: [
        "Georg Fischer Stress Less clamp fixpoint anchor",
        "GF piping systems pipe anchor plastic",
      ],
      preferredVendor: "Georg Fischer",
      fallbackProducts: [{
        vendor: "Georg Fischer",
        productName: "Stress Less Clamp Fixpoint Kit",
        productUrl: "https://www.gfps.com/us/en/products/piping-systems/industrial/stress-less.html",
        assemblyDrawing: "ANC-1",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
    riser_clamp: {
      queries: [
        "Georg Fischer Stress Less riser clamp vertical pipe",
        "GF piping systems riser support clamp",
      ],
      preferredVendor: "Georg Fischer",
      fallbackProducts: [{
        vendor: "Georg Fischer",
        productName: "Stress Less Riser Clamp",
        productUrl: "https://www.gfps.com/us/en/products/piping-systems/industrial/stress-less.html",
        assemblyDrawing: "RSR-1",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
    slide: {
      queries: [
        "Georg Fischer Stress Less pipe slide support",
        "GF piping systems slide support thermal expansion",
      ],
      preferredVendor: "Georg Fischer",
      fallbackProducts: [{
        vendor: "Georg Fischer",
        productName: "Stress Less Slide Support",
        productUrl: "https://www.gfps.com/us/en/products/piping-systems/industrial/stress-less.html",
        assemblyDrawing: "SLD-1",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
  },
  metal: {
    hanger: {
      queries: [
        "Anvil pipe hanger clevis carbon steel",
        "Cooper B-Line pipe hanger support",
        "PHD Manufacturing clevis hanger",
      ],
      preferredVendor: "Anvil",
      fallbackProducts: [{
        vendor: "Anvil International",
        productName: "Fig. 260 Clevis Hanger",
        partNumber: "Fig. 260",
        productUrl: "https://www.anvilintl.com/products/pipe-hangers-supports/clevis-hangers",
        assemblyDrawing: "HGR-2",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
    guide: {
      queries: [
        "Anvil pipe guide restraint steel",
        "Cooper B-Line pipe guide support",
        "pipe guide bracket carbon steel",
      ],
      preferredVendor: "Anvil",
      fallbackProducts: [{
        vendor: "Anvil International",
        productName: "Fig. 224 Pipe Guide",
        partNumber: "Fig. 224",
        productUrl: "https://www.anvilintl.com/products/pipe-hangers-supports/guides-shields",
        assemblyDrawing: "GDE-2",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
    anchor: {
      queries: [
        "Anvil pipe anchor restraint steel",
        "Unistrut Cush-a-Clamp pipe anchor",
        "Cooper B-Line pipe anchor",
      ],
      preferredVendor: "Anvil",
      fallbackProducts: [{
        vendor: "Anvil International",
        productName: "Fig. 265 Pipe Anchor",
        partNumber: "Fig. 265",
        productUrl: "https://www.anvilintl.com/products/pipe-hangers-supports/anchors",
        assemblyDrawing: "ANC-2",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
    riser_clamp: {
      queries: [
        "Anvil riser clamp vertical pipe support",
        "Cooper B-Line riser clamp",
        "pipe riser clamp carbon steel",
      ],
      preferredVendor: "Anvil",
      fallbackProducts: [{
        vendor: "Anvil International",
        productName: "Fig. 261 Riser Clamp",
        partNumber: "Fig. 261",
        productUrl: "https://www.anvilintl.com/products/pipe-hangers-supports/riser-clamps",
        assemblyDrawing: "RSR-2",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
    slide: {
      queries: [
        "pipe slide support thermal expansion steel",
        "Anvil pipe slide plate assembly",
      ],
      preferredVendor: "Anvil",
      fallbackProducts: [{
        vendor: "Anvil International",
        productName: "Slide Plate Assembly",
        productUrl: "https://www.anvilintl.com/products/pipe-hangers-supports",
        assemblyDrawing: "SLD-2",
        isPreferred: true,
        searchConfidence: 0.5,
      }],
    },
  },
};

/**
 * Search Tavily for specific product URLs
 */
async function searchForProduct(query: string, pipeSize: string): Promise<{ url: string; title: string; content: string }[]> {
  if (!TAVILY_API_KEY) {
    return [];
  }

  const fullQuery = `${query} ${pipeSize} specifications product page`;

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: fullQuery,
        search_depth: "advanced",
        include_images: true,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      console.error(`Tavily search failed: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.results?.map((r: any) => ({
      url: r.url,
      title: r.title,
      content: r.content,
    })) || [];
  } catch (error) {
    console.error("Tavily search error:", error);
    return [];
  }
}

/**
 * Detect vendor from URL
 */
function detectVendor(url: string): string {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes("gfps.com") || urlLower.includes("georgfischer")) return "Georg Fischer";
  if (urlLower.includes("anvil")) return "Anvil International";
  if (urlLower.includes("cooper") || urlLower.includes("b-line")) return "Cooper B-Line";
  if (urlLower.includes("phd")) return "PHD Manufacturing";
  if (urlLower.includes("unistrut")) return "Unistrut";
  if (urlLower.includes("hilti")) return "Hilti";
  if (urlLower.includes("nibco")) return "NIBCO";
  if (urlLower.includes("mcmaster")) return "McMaster-Carr";
  if (urlLower.includes("grainger")) return "Grainger";
  
  return "Unknown";
}

/**
 * Check if URL should be skipped for scraping
 */
function shouldSkipScraping(url: string): boolean {
  const urlLower = url.toLowerCase();
  return (
    urlLower.endsWith('.pdf') ||
    urlLower.includes('/pdf/') ||
    urlLower.includes('/documents/') ||
    urlLower.includes('/download/') ||
    urlLower.includes('/catalog/') ||
    urlLower.includes('mcmaster.com') || // McMaster requires login
    urlLower.includes('grainger.com') // Grainger has bot protection
  );
}

// ============================================================================
// CACHE FUNCTIONS
// ============================================================================

/**
 * Check cache for existing hardware products
 */
async function getCachedProducts(
  materialType: string,
  supportFunction: string,
  pipeSize: string
): Promise<HardwareProduct[] | null> {
  try {
    const now = new Date();
    
    // Find non-expired cached products
    const cached = await prisma.scrapedHardwareCache.findMany({
      where: {
        materialType,
        supportFunction,
        pipeSize,
        expiresAt: { gt: now },
      },
      orderBy: [
        { isPreferred: "desc" },
        { searchConfidence: "desc" },
      ],
      take: 5,
    });

    if (cached.length === 0) {
      return null;
    }

    // Update hit count and last accessed time
    await prisma.scrapedHardwareCache.updateMany({
      where: {
        id: { in: cached.map(c => c.id) },
      },
      data: {
        hitCount: { increment: 1 },
        lastAccessedAt: now,
      },
    });

    // Map to HardwareProduct format
    return cached.map(c => ({
      vendor: c.vendor,
      productName: c.productName,
      partNumber: c.partNumber || undefined,
      productUrl: c.productUrl,
      imageUrl: c.imageUrl || undefined,
      datasheetUrl: c.datasheetUrl || undefined,
      assemblyDrawing: c.assemblyDrawing || undefined,
      description: c.description || undefined,
      specifications: c.specifications as Record<string, string> | undefined,
      isPreferred: c.isPreferred,
      searchConfidence: Number(c.searchConfidence),
    }));
  } catch (error) {
    console.error("Cache lookup error:", error);
    return null;
  }
}

/**
 * Save products to cache
 */
async function cacheProducts(
  materialType: string,
  supportFunction: string,
  pipeSize: string,
  products: HardwareProduct[]
): Promise<void> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);

    for (const product of products) {
      await prisma.scrapedHardwareCache.upsert({
        where: {
          materialType_supportFunction_pipeSize_productUrl: {
            materialType,
            supportFunction,
            pipeSize,
            productUrl: product.productUrl,
          },
        },
        create: {
          materialType,
          supportFunction,
          pipeSize,
          vendor: product.vendor,
          productName: product.productName,
          partNumber: product.partNumber,
          productUrl: product.productUrl,
          imageUrl: product.imageUrl,
          datasheetUrl: product.datasheetUrl,
          assemblyDrawing: product.assemblyDrawing,
          description: product.description,
          specifications: product.specifications || {},
          isPreferred: product.isPreferred,
          searchConfidence: product.searchConfidence,
          scrapedAt: now,
          expiresAt,
        },
        update: {
          vendor: product.vendor,
          productName: product.productName,
          partNumber: product.partNumber,
          imageUrl: product.imageUrl,
          datasheetUrl: product.datasheetUrl,
          assemblyDrawing: product.assemblyDrawing,
          description: product.description,
          specifications: product.specifications || {},
          isPreferred: product.isPreferred,
          searchConfidence: product.searchConfidence,
          scrapedAt: now,
          expiresAt,
        },
      });
    }

    console.log(`Cached ${products.length} products for ${materialType}/${supportFunction}/${pipeSize}`);
  } catch (error) {
    // Don't fail the main operation if caching fails
    console.error("Cache write error:", error);
  }
}

/**
 * Clear expired cache entries (can be called periodically)
 */
export async function cleanExpiredCache(): Promise<number> {
  try {
    const result = await prisma.scrapedHardwareCache.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    console.log(`Cleaned ${result.count} expired cache entries`);
    return result.count;
  } catch (error) {
    console.error("Cache cleanup error:", error);
    return 0;
  }
}

/**
 * Force refresh cache for a specific product type
 */
export async function invalidateCache(
  materialType?: string,
  supportFunction?: string,
  pipeSize?: string
): Promise<number> {
  try {
    const where: Record<string, string> = {};
    if (materialType) where.materialType = materialType;
    if (supportFunction) where.supportFunction = supportFunction;
    if (pipeSize) where.pipeSize = pipeSize;

    const result = await prisma.scrapedHardwareCache.deleteMany({ where });
    console.log(`Invalidated ${result.count} cache entries`);
    return result.count;
  } catch (error) {
    console.error("Cache invalidation error:", error);
    return 0;
  }
}

// ============================================================================
// MAIN SEARCH FUNCTION (WITH CACHING)
// ============================================================================

/**
 * Search and scrape for a specific hardware product
 * Uses cache-first strategy for performance
 */
export async function findSpecificProduct(
  materialType: "plastic" | "metal",
  supportFunction: "hanger" | "guide" | "anchor" | "riser_clamp" | "slide",
  pipeSize: string,
  options: {
    isInsulated?: boolean;
    enableScraping?: boolean;
    forceRefresh?: boolean;  // Skip cache and fetch fresh data
    useCache?: boolean;      // Enable/disable caching (default: true)
  } = {}
): Promise<HardwareSearchResult> {
  const { 
    isInsulated = false, 
    enableScraping = true, 
    forceRefresh = false,
    useCache = true,
  } = options;
  
  const config = PRODUCT_SEARCH_CONFIG[materialType]?.[supportFunction];
  if (!config) {
    return {
      success: false,
      products: [],
      error: `No configuration for ${materialType} ${supportFunction}`,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1: Check cache first (unless forceRefresh)
  // ─────────────────────────────────────────────────────────────────────────
  if (useCache && !forceRefresh) {
    const cachedProducts = await getCachedProducts(materialType, supportFunction, pipeSize);
    if (cachedProducts && cachedProducts.length > 0) {
      console.log(`Cache HIT for ${materialType}/${supportFunction}/${pipeSize} (${cachedProducts.length} products)`);
      return {
        success: true,
        products: cachedProducts.slice(0, 3),
        searchQuery: config.queries[0],
        fromCache: true,
      };
    }
    console.log(`Cache MISS for ${materialType}/${supportFunction}/${pipeSize}`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2: Search and scrape fresh data
  // ─────────────────────────────────────────────────────────────────────────
  const products: HardwareProduct[] = [];
  const searchedUrls = new Set<string>();

  // Try each search query
  for (const query of config.queries) {
    const searchResults = await searchForProduct(query, pipeSize);
    
    for (const result of searchResults) {
      // Skip if we've already processed this URL
      if (searchedUrls.has(result.url)) continue;
      searchedUrls.add(result.url);
      
      const vendor = detectVendor(result.url);
      const isPreferred = vendor === config.preferredVendor;
      
      let product: HardwareProduct = {
        vendor,
        productName: cleanProductName(result.title),
        productUrl: result.url,
        description: result.content?.substring(0, 200),
        isPreferred,
        searchConfidence: isPreferred ? 0.9 : 0.7,
      };

      // Scrape the product page for more details (with timeout and skip logic)
      if (enableScraping && process.env.FIRECRAWL_API_KEY && !shouldSkipScraping(result.url)) {
        try {
          // Race between scraping and a timeout
          const scrapePromise = scrapeProductPage(result.url);
          const timeoutPromise = new Promise<null>((resolve) => 
            setTimeout(() => resolve(null), 8000) // 8 second timeout
          );
          
          const scrapeResult = await Promise.race([scrapePromise, timeoutPromise]);
          
          if (scrapeResult && scrapeResult.success && scrapeResult.product) {
            product = {
              ...product,
              productName: scrapeResult.product.name || product.productName,
              partNumber: scrapeResult.product.partNumber,
              imageUrl: scrapeResult.product.imageUrl,
              datasheetUrl: scrapeResult.product.datasheetUrl,
              specifications: scrapeResult.product.specifications,
              description: scrapeResult.product.description || product.description,
              searchConfidence: 0.95,
            };
          }
        } catch (error) {
          // Silently fail - we still have the search result
          console.log(`Scraping skipped for ${result.url}: ${error instanceof Error ? error.message : 'timeout'}`);
        }
      }

      products.push(product);
      
      // Limit to 2 products per search to speed things up
      if (products.length >= 2) break;
    }
    
    // If we found products from preferred vendor, stop searching
    if (products.some(p => p.isPreferred)) break;
  }

  // If no products found, use fallbacks
  if (products.length === 0) {
    products.push(...config.fallbackProducts);
  }

  // Sort: preferred first, then by confidence
  products.sort((a, b) => {
    if (a.isPreferred !== b.isPreferred) return a.isPreferred ? -1 : 1;
    return b.searchConfidence - a.searchConfidence;
  });

  const finalProducts = products.slice(0, 3); // Max 3 products

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3: Save to cache for future requests
  // ─────────────────────────────────────────────────────────────────────────
  if (useCache && finalProducts.length > 0) {
    // Cache asynchronously - don't block the response
    cacheProducts(materialType, supportFunction, pipeSize, finalProducts).catch(err => {
      console.error("Background cache write failed:", err);
    });
  }

  return {
    success: finalProducts.length > 0,
    products: finalProducts,
    searchQuery: config.queries[0],
    fromCache: false,
  };
}

/**
 * Find all support hardware for a calculation result
 * Uses cache-first strategy for all lookups
 */
export async function findAllSupportHardware(params: {
  materialType: "plastic" | "metal";
  pipeSize: string;
  isInsulated: boolean;
  mountingMethod?: string;
  needsDeadweight: boolean;
  needsLateral: boolean;
  needsAxial: boolean;
  isVertical: boolean;
  forceRefresh?: boolean;  // Skip cache for all lookups
}): Promise<{
  deadweight?: HardwareSearchResult;
  lateral?: HardwareSearchResult;
  axial?: HardwareSearchResult;
  allFromCache?: boolean;
}> {
  const results: {
    deadweight?: HardwareSearchResult;
    lateral?: HardwareSearchResult;
    axial?: HardwareSearchResult;
    allFromCache?: boolean;
  } = {};

  const searchOptions = {
    isInsulated: params.isInsulated,
    enableScraping: true,
    forceRefresh: params.forceRefresh || false,
    useCache: true,
  };

  // Run searches in parallel for speed
  const promises: Promise<void>[] = [];

  // Deadweight support
  if (params.needsDeadweight) {
    const supportType = params.isVertical ? "riser_clamp" : "hanger";
    promises.push(
      findSpecificProduct(params.materialType, supportType, params.pipeSize, searchOptions)
        .then(result => { results.deadweight = result; })
    );
  }

  // Lateral support (guides)
  if (params.needsLateral) {
    promises.push(
      findSpecificProduct(params.materialType, "guide", params.pipeSize, searchOptions)
        .then(result => { results.lateral = result; })
    );
  }

  // Axial support (anchors)
  if (params.needsAxial) {
    promises.push(
      findSpecificProduct(params.materialType, "anchor", params.pipeSize, searchOptions)
        .then(result => { results.axial = result; })
    );
  }

  await Promise.all(promises);

  // Check if all results came from cache
  const allResults = [results.deadweight, results.lateral, results.axial].filter(Boolean);
  results.allFromCache = allResults.length > 0 && allResults.every(r => r?.fromCache);

  return results;
}

/**
 * Clean product name from search result title
 */
function cleanProductName(title: string): string {
  return title
    .replace(/\s*[-|–—]\s*.*?(\.com|systems?|manufacturing|inc\.?|corp\.?|international|products?).*$/i, "")
    .replace(/\s*\|\s*.*$/, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 80);
}

/**
 * Quick search without scraping (faster, for previews)
 * Still uses cache - if cached data exists, returns it immediately
 */
export async function quickSearchHardware(
  materialType: "plastic" | "metal",
  supportFunction: "hanger" | "guide" | "anchor" | "riser_clamp" | "slide",
  pipeSize: string
): Promise<HardwareSearchResult> {
  return findSpecificProduct(materialType, supportFunction, pipeSize, {
    enableScraping: false,
    useCache: true,
  });
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalEntries: number;
  expiredEntries: number;
  byMaterialType: Record<string, number>;
  bySupportFunction: Record<string, number>;
  totalHits: number;
}> {
  try {
    const now = new Date();
    
    const [total, expired, byMaterial, bySupport, hits] = await Promise.all([
      prisma.scrapedHardwareCache.count(),
      prisma.scrapedHardwareCache.count({ where: { expiresAt: { lt: now } } }),
      prisma.scrapedHardwareCache.groupBy({
        by: ["materialType"],
        _count: true,
      }),
      prisma.scrapedHardwareCache.groupBy({
        by: ["supportFunction"],
        _count: true,
      }),
      prisma.scrapedHardwareCache.aggregate({
        _sum: { hitCount: true },
      }),
    ]);

    return {
      totalEntries: total,
      expiredEntries: expired,
      byMaterialType: Object.fromEntries(byMaterial.map(m => [m.materialType, m._count])),
      bySupportFunction: Object.fromEntries(bySupport.map(s => [s.supportFunction, s._count])),
      totalHits: hits._sum.hitCount || 0,
    };
  } catch (error) {
    console.error("Cache stats error:", error);
    return {
      totalEntries: 0,
      expiredEntries: 0,
      byMaterialType: {},
      bySupportFunction: {},
      totalHits: 0,
    };
  }
}
