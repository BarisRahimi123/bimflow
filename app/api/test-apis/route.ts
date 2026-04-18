// Test API Endpoint
// Verifies that all external services (Claude, Tavily, Firecrawl) are properly configured

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from "@anthropic-ai/sdk";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface TestResult {
  service: string;
  status: 'success' | 'error' | 'not_configured';
  message: string;
  responseTime?: number;
  details?: any;
}

/**
 * Test Claude API
 */
async function testClaudeAPI(): Promise<TestResult> {
  if (!ANTHROPIC_API_KEY) {
    return {
      service: 'Claude AI',
      status: 'not_configured',
      message: 'ANTHROPIC_API_KEY not found in environment variables',
    };
  }

  const startTime = Date.now();
  try {
    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: "Reply with exactly: API_TEST_SUCCESS",
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === "text");
    const responseTime = Date.now() - startTime;

    if (textContent && textContent.type === "text" && textContent.text.includes("API_TEST_SUCCESS")) {
      return {
        service: 'Claude AI',
        status: 'success',
        message: 'Claude API is working correctly',
        responseTime,
        details: {
          model: response.model,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };
    }

    return {
      service: 'Claude AI',
      status: 'error',
      message: 'Unexpected response from Claude',
      responseTime,
    };
  } catch (error) {
    return {
      service: 'Claude AI',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Test Tavily API
 */
async function testTavilyAPI(): Promise<TestResult> {
  if (!TAVILY_API_KEY) {
    return {
      service: 'Tavily Search',
      status: 'not_configured',
      message: 'TAVILY_API_KEY not found in environment variables',
    };
  }

  const startTime = Date.now();
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: "Georg Fischer pipe support products",
        search_depth: "basic",
        max_results: 3,
      }),
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        service: 'Tavily Search',
        status: 'error',
        message: `API returned ${response.status}: ${errorData.error || 'Unknown error'}`,
        responseTime,
      };
    }

    const data = await response.json();

    return {
      service: 'Tavily Search',
      status: 'success',
      message: 'Tavily API is working correctly',
      responseTime,
      details: {
        resultsCount: data.results?.length || 0,
        sampleResult: data.results?.[0]?.title || 'No results',
      },
    };
  } catch (error) {
    return {
      service: 'Tavily Search',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Test Firecrawl API
 */
async function testFirecrawlAPI(): Promise<TestResult> {
  if (!FIRECRAWL_API_KEY) {
    return {
      service: 'Firecrawl Scraper',
      status: 'not_configured',
      message: 'FIRECRAWL_API_KEY not found in environment variables',
    };
  }

  const startTime = Date.now();
  try {
    // Test with a simple, fast URL
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: "https://www.gfps.com/us/en.html",
        formats: ["markdown"],
        onlyMainContent: true,
        timeout: 10000,
      }),
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        service: 'Firecrawl Scraper',
        status: 'error',
        message: `API returned ${response.status}: ${errorData.error || 'Unknown error'}`,
        responseTime,
      };
    }

    const data = await response.json();

    if (!data.success) {
      return {
        service: 'Firecrawl Scraper',
        status: 'error',
        message: data.error || 'Scrape failed',
        responseTime,
      };
    }

    return {
      service: 'Firecrawl Scraper',
      status: 'success',
      message: 'Firecrawl API is working correctly',
      responseTime,
      details: {
        pageTitle: data.data?.metadata?.title || 'Unknown',
        contentLength: data.data?.markdown?.length || 0,
      },
    };
  } catch (error) {
    return {
      service: 'Firecrawl Scraper',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - startTime,
    };
  }
}

export async function GET(request: NextRequest) {
  const results: TestResult[] = [];
  
  // Run all tests in parallel
  const [claudeResult, tavilyResult, firecrawlResult] = await Promise.all([
    testClaudeAPI(),
    testTavilyAPI(),
    testFirecrawlAPI(),
  ]);

  results.push(claudeResult, tavilyResult, firecrawlResult);

  // Calculate overall status
  const allSuccess = results.every(r => r.status === 'success');
  const anyError = results.some(r => r.status === 'error');
  const anyNotConfigured = results.some(r => r.status === 'not_configured');

  return NextResponse.json({
    success: allSuccess,
    timestamp: new Date().toISOString(),
    summary: {
      allConfigured: !anyNotConfigured,
      allWorking: allSuccess,
      hasErrors: anyError,
      configured: results.filter(r => r.status !== 'not_configured').length,
      working: results.filter(r => r.status === 'success').length,
      total: results.length,
    },
    results,
    help: {
      claude: 'Get API key from https://console.anthropic.com/',
      tavily: 'Get API key from https://app.tavily.com/',
      firecrawl: 'Get API key from https://firecrawl.dev/',
      envVars: ['ANTHROPIC_API_KEY', 'TAVILY_API_KEY', 'FIRECRAWL_API_KEY'],
    },
  });
}

export async function POST(request: NextRequest) {
  // Allow testing specific service
  const { service } = await request.json().catch(() => ({}));
  
  let result: TestResult;
  
  switch (service?.toLowerCase()) {
    case 'claude':
      result = await testClaudeAPI();
      break;
    case 'tavily':
      result = await testTavilyAPI();
      break;
    case 'firecrawl':
      result = await testFirecrawlAPI();
      break;
    default:
      return NextResponse.json(
        { error: 'Invalid service. Use: claude, tavily, or firecrawl' },
        { status: 400 }
      );
  }
  
  return NextResponse.json({
    success: result.status === 'success',
    result,
  });
}
