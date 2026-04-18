// Tavily AI Search Service
// Finds relevant vendor product URLs for piping materials

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_API_URL = "https://api.tavily.com/search";

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilyResponse {
  success: boolean;
  results: TavilySearchResult[];
  query: string;
  error?: string;
}

// Preferred vendors for different material types
const PREFERRED_VENDORS: Record<string, string[]> = {
  plastic: ["Georg Fischer", "GF Piping", "Spears", "Charlotte Pipe", "NIBCO"],
  metal: ["Anvil", "Victaulic", "NIBCO", "Smith-Cooper", "Weldbend"],
  copper: ["Mueller", "Cerro", "Cambridge-Lee", "NIBCO"],
  stainless: ["Swagelok", "Parker", "Ham-Let", "Hy-Lok"],
  supports: ["Georg Fischer", "Anvil", "PHD Manufacturing", "Cooper B-Line", "Unistrut"],
};

/**
 * Search for vendor product pages using Tavily AI
 */
export async function searchVendorProducts(
  material: string,
  pipeSize: string,
  productType: string = "pipe"
): Promise<TavilyResponse> {
  if (!TAVILY_API_KEY) {
    return {
      success: false,
      results: [],
      query: "",
      error: "TAVILY_API_KEY not configured",
    };
  }

  // Determine which vendors to prioritize
  const materialLower = material.toLowerCase();
  let vendors: string[] = [];
  
  if (materialLower.includes("pvc") || materialLower.includes("cpvc") || materialLower.includes("pp") || materialLower.includes("pvdf")) {
    vendors = PREFERRED_VENDORS.plastic;
  } else if (materialLower.includes("copper")) {
    vendors = PREFERRED_VENDORS.copper;
  } else if (materialLower.includes("stainless")) {
    vendors = PREFERRED_VENDORS.stainless;
  } else {
    vendors = PREFERRED_VENDORS.metal;
  }

  // Build search query
  const vendorStr = vendors.slice(0, 3).join(" OR ");
  const query = `${material} ${pipeSize} ${productType} product page (${vendorStr})`;

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: "advanced",
        include_domains: [
          "gfps.com",
          "georgfischer.com",
          "spears.com",
          "charlottepipe.com",
          "nibco.com",
          "anvilintl.com",
          "victaulic.com",
          "swagelok.com",
          "mueller.com",
        ],
        max_results: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      results: data.results?.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })) || [],
      query,
    };
  } catch (error) {
    console.error("Tavily search error:", error);
    return {
      success: false,
      results: [],
      query,
      error: error instanceof Error ? error.message : "Search failed",
    };
  }
}

/**
 * Search for pipe support hardware
 */
export async function searchSupportHardware(
  materialType: "plastic" | "metal",
  supportType: string,
  pipeSize: string
): Promise<TavilyResponse> {
  if (!TAVILY_API_KEY) {
    return {
      success: false,
      results: [],
      query: "",
      error: "TAVILY_API_KEY not configured",
    };
  }

  const vendors = PREFERRED_VENDORS.supports;
  const vendorStr = vendors.slice(0, 3).join(" OR ");
  
  let searchTerm = "";
  if (materialType === "plastic") {
    searchTerm = `GF Stress Less ${supportType} ${pipeSize}`;
  } else {
    searchTerm = `pipe ${supportType} ${pipeSize} (${vendorStr})`;
  }

  const query = `${searchTerm} product specifications`;

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: "basic",
        max_results: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      results: data.results?.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })) || [],
      query,
    };
  } catch (error) {
    console.error("Tavily search error:", error);
    return {
      success: false,
      results: [],
      query,
      error: error instanceof Error ? error.message : "Search failed",
    };
  }
}

/**
 * Batch search for multiple products
 */
export async function batchSearchProducts(
  items: Array<{ material: string; size: string; type?: string }>
): Promise<Map<string, TavilyResponse>> {
  const results = new Map<string, TavilyResponse>();
  
  // Process in parallel with rate limiting
  const batchSize = 3;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const promises = batch.map(async (item) => {
      const key = `${item.material}-${item.size}`;
      const result = await searchVendorProducts(
        item.material,
        item.size,
        item.type || "pipe"
      );
      return { key, result };
    });
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ key, result }) => {
      results.set(key, result);
    });
    
    // Rate limit delay
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  
  return results;
}
