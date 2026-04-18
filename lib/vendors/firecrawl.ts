// Firecrawl Web Scraping Service
// Extracts product details and images from vendor websites

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1";

export interface ProductDetails {
  name: string;
  manufacturer: string;
  partNumber: string;
  description: string;
  specifications: Record<string, string>;
  datasheetUrl?: string;
  imageUrl?: string;
  price?: string;
  url: string;
}

export interface FirecrawlResponse {
  success: boolean;
  product?: ProductDetails;
  error?: string;
}

/**
 * Scrape product details from a vendor product page
 */
export async function scrapeProductPage(url: string): Promise<FirecrawlResponse> {
  if (!FIRECRAWL_API_KEY) {
    return {
      success: false,
      error: "FIRECRAWL_API_KEY not configured",
    };
  }

  try {
    // Scrape the page with Firecrawl
    const scrapeResponse = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "html"],
        onlyMainContent: true,
        includeTags: ["img", "a"],
        timeout: 15000,
      }),
    });

    if (!scrapeResponse.ok) {
      const errorText = await scrapeResponse.text();
      throw new Error(`Firecrawl API error: ${scrapeResponse.status} - ${errorText}`);
    }

    const scrapeData = await scrapeResponse.json();
    
    if (!scrapeData.success) {
      throw new Error(scrapeData.error || "Scrape failed");
    }

    // Extract product details from the scraped content
    const product = parseProductDetails(scrapeData.data, url);

    return {
      success: true,
      product,
    };
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Scrape failed",
    };
  }
}

/**
 * Parse product details from scraped content
 */
function parseProductDetails(data: any, url: string): ProductDetails {
  const markdown = data.markdown || "";
  const html = data.html || "";
  const metadata = data.metadata || {};
  
  // Extract product name from title or content
  let name = metadata.title || "";
  name = name
    .replace(/\s*[-|–—]\s*.*?(Georg Fischer|GF|Anvil|Cooper|PHD|Unistrut).*$/i, "")
    .replace(/\s*\|.*$/, "")
    .trim();
  
  // Try to extract manufacturer from URL or content
  let manufacturer = detectManufacturer(url, markdown);
  
  // Extract part number (look for patterns)
  let partNumber = extractPartNumber(markdown, html);
  
  // Extract description
  let description = metadata.description || "";
  if (!description || description.length < 50) {
    description = extractDescription(markdown);
  }
  
  // Extract specifications
  const specifications = extractSpecifications(markdown);
  
  // Extract image URL - try multiple methods
  let imageUrl = extractProductImage(html, metadata, url);
  
  // Extract datasheet link
  let datasheetUrl = extractDatasheetUrl(markdown, html, url);
  
  return {
    name: name || "Product",
    manufacturer,
    partNumber,
    description,
    specifications,
    datasheetUrl,
    imageUrl,
    url,
  };
}

/**
 * Detect manufacturer from URL and content
 */
function detectManufacturer(url: string, content: string): string {
  const combined = (url + " " + content).toLowerCase();
  
  if (combined.includes("gfps.com") || combined.includes("georgfischer") || combined.includes("georg fischer")) {
    return "Georg Fischer";
  }
  if (combined.includes("anvil")) return "Anvil International";
  if (combined.includes("spears.com")) return "Spears Manufacturing";
  if (combined.includes("charlottepipe")) return "Charlotte Pipe";
  if (combined.includes("nibco")) return "NIBCO";
  if (combined.includes("victaulic")) return "Victaulic";
  if (combined.includes("swagelok")) return "Swagelok";
  if (combined.includes("cooper") || combined.includes("b-line")) return "Cooper B-Line";
  if (combined.includes("phd")) return "PHD Manufacturing";
  if (combined.includes("unistrut")) return "Unistrut";
  if (combined.includes("hilti")) return "Hilti";
  if (combined.includes("mcmaster")) return "McMaster-Carr";
  if (combined.includes("grainger")) return "Grainger";
  
  return "Unknown";
}

/**
 * Extract part number from content
 */
function extractPartNumber(markdown: string, html: string): string {
  const combined = markdown + " " + html;
  
  // Try various patterns
  const patterns = [
    /(?:Part\s*(?:#|No\.?|Number)?|SKU|Model|Item\s*(?:#|No\.?)?|Catalog\s*(?:#|No\.?)?|Product\s*(?:#|No\.?|Code)?|Article\s*(?:#|No\.?)?)[\s:]*([A-Z0-9][-A-Z0-9_.]+[A-Z0-9])/i,
    /(?:Fig\.?\s*|Figure\s*)(\d{2,4})/i,
    /\b([A-Z]{2,4}[-\s]?\d{3,}[-\s]?[A-Z0-9]*)\b/,
    /"partNumber"[\s:]*"([^"]+)"/i,
    /"sku"[\s:]*"([^"]+)"/i,
  ];
  
  for (const pattern of patterns) {
    const match = combined.match(pattern);
    if (match && match[1]) {
      const partNum = match[1].trim();
      // Validate it looks like a part number
      if (partNum.length >= 3 && partNum.length <= 30 && /[0-9]/.test(partNum)) {
        return partNum;
      }
    }
  }
  
  return "";
}

/**
 * Extract description from content
 */
function extractDescription(markdown: string): string {
  // Look for first substantial paragraph
  const paragraphs = markdown.split(/\n\n+/);
  
  for (const para of paragraphs) {
    const cleaned = para
      .replace(/^#+\s+.*$/gm, "") // Remove headers
      .replace(/^\s*[-*]\s+/gm, "") // Remove list markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links but keep text
      .trim();
    
    if (cleaned.length >= 50 && cleaned.length <= 500 && !cleaned.startsWith("http")) {
      return cleaned;
    }
  }
  
  return "";
}

/**
 * Extract specifications from content
 */
function extractSpecifications(markdown: string): Record<string, string> {
  const specs: Record<string, string> = {};
  
  // Look for specification patterns
  const specPatterns = [
    { key: "Size", pattern: /(?:Size|Diameter|Pipe Size)[\s:]+([^\n]+)/gi },
    { key: "Material", pattern: /(?:Material|Type|Made of)[\s:]+([^\n]+)/gi },
    { key: "Pressure Rating", pattern: /(?:Pressure\s*Rating|Max\s*Pressure|Working\s*Pressure)[\s:]+([^\n]+)/gi },
    { key: "Temperature", pattern: /(?:Temperature\s*Range|Max\s*Temp|Operating\s*Temp)[\s:]+([^\n]+)/gi },
    { key: "Standard", pattern: /(?:Standard|Specification|Complies?\s*with)[\s:]+([^\n]+)/gi },
    { key: "Finish", pattern: /(?:Finish|Coating|Surface)[\s:]+([^\n]+)/gi },
    { key: "Load Rating", pattern: /(?:Load\s*Rating|Max\s*Load|Capacity)[\s:]+([^\n]+)/gi },
  ];
  
  for (const { key, pattern } of specPatterns) {
    const match = markdown.match(pattern);
    if (match && match[1]) {
      const value = match[1].trim().substring(0, 100);
      if (value && !value.startsWith("http")) {
        specs[key] = value;
      }
    }
  }
  
  return specs;
}

/**
 * Extract product image URL
 */
function extractProductImage(html: string, metadata: any, pageUrl: string): string | undefined {
  // Try Open Graph image first (usually the main product image)
  if (metadata.ogImage) {
    return normalizeUrl(metadata.ogImage, pageUrl);
  }
  
  // Try Twitter card image
  if (metadata.twitterImage) {
    return normalizeUrl(metadata.twitterImage, pageUrl);
  }
  
  // Look for product images in HTML
  const imagePatterns = [
    // Product-specific image classes/IDs
    /<img[^>]+(?:class|id)=["'][^"']*(?:product|main|hero|gallery|primary)[^"']*["'][^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+src=["']([^"']+)["'][^>]+(?:class|id)=["'][^"']*(?:product|main|hero|gallery|primary)[^"']*["']/gi,
    // Images with product in URL
    /<img[^>]+src=["']([^"']*(?:product|item|catalog)[^"']*)["']/gi,
    // Large images (likely product images)
    /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["'][^>]+(?:width|height)=["']?[4-9]\d{2,}/gi,
  ];
  
  for (const pattern of imagePatterns) {
    const match = html.match(pattern);
    if (match) {
      // Get the src from the first match
      const srcMatch = match[0].match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        const imgUrl = srcMatch[1];
        // Filter out icons, logos, and very small images
        if (!imgUrl.includes("logo") && 
            !imgUrl.includes("icon") && 
            !imgUrl.includes("favicon") &&
            !imgUrl.includes("avatar") &&
            !imgUrl.includes("placeholder") &&
            imgUrl.length > 10) {
          return normalizeUrl(imgUrl, pageUrl);
        }
      }
    }
  }
  
  // Try JSON-LD structured data
  const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (jsonLdMatch) {
    try {
      const jsonLd = JSON.parse(jsonLdMatch[1]);
      if (jsonLd.image) {
        const imgUrl = Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image;
        if (typeof imgUrl === "string") {
          return normalizeUrl(imgUrl, pageUrl);
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }
  
  return undefined;
}

/**
 * Extract datasheet/PDF link
 */
function extractDatasheetUrl(markdown: string, html: string, pageUrl: string): string | undefined {
  const combined = markdown + " " + html;
  
  const patterns = [
    /href=["']([^"']*(?:datasheet|data-sheet|spec-sheet|specification|brochure|catalog)[^"']*\.pdf)["']/i,
    /href=["']([^"']+\.pdf)["'][^>]*>(?:[^<]*(?:datasheet|specification|brochure|download|pdf)[^<]*)/i,
    /\[(?:datasheet|specifications?|pdf|download|brochure)\]\(([^)]+\.pdf)\)/i,
    /href=["']([^"']+\/documents?\/[^"']+\.pdf)["']/i,
  ];
  
  for (const pattern of patterns) {
    const match = combined.match(pattern);
    if (match && match[1]) {
      return normalizeUrl(match[1], pageUrl);
    }
  }
  
  return undefined;
}

/**
 * Normalize relative URLs to absolute
 */
function normalizeUrl(url: string, baseUrl: string): string {
  if (!url) return "";
  
  // Already absolute
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // Protocol-relative
  if (url.startsWith("//")) {
    return "https:" + url;
  }
  
  try {
    const base = new URL(baseUrl);
    return new URL(url, base.origin).href;
  } catch (e) {
    return url;
  }
}

/**
 * Batch scrape multiple product URLs
 */
export async function batchScrapeProducts(
  urls: string[]
): Promise<Map<string, FirecrawlResponse>> {
  const results = new Map<string, FirecrawlResponse>();
  
  // Process in parallel with rate limiting
  const batchSize = 2;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const promises = batch.map(async (url) => {
      const result = await scrapeProductPage(url);
      return { url, result };
    });
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ url, result }) => {
      results.set(url, result);
    });
    
    // Rate limit delay
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Check if Firecrawl is configured
 */
export function isFirecrawlConfigured(): boolean {
  return !!FIRECRAWL_API_KEY;
}
