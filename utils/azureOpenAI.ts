/**
 * Azure OpenAI API Utility for Product Generation
 * This module handles all AI-powered product information generation
 */

// Types for AI-generated product data
export interface AIGeneratedProduct {
  productNames: string[];
  price: number;
  salePrice?: number;
  category: 'Floral' | 'Luxury' | 'Gift Set' | 'Seasonal';
  shortDescription: string;
  fullDescription: string;
  size: string;
  burnTime: string;
  scentNotes: string[];
  quote: string;
}

export interface AIGenerationError {
  message: string;
  code: string;
}

// Azure OpenAI configuration from environment variables
const getConfig = () => ({
  endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
  apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
  deploymentName: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || '',
  apiVersion: import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
});

// Check if Azure OpenAI is properly configured
export const isAzureOpenAIConfigured = (): boolean => {
  const config = getConfig();
  return !!(config.endpoint && config.apiKey && config.deploymentName);
};

// System prompt for product generation
const SYSTEM_PROMPT = `You are a creative product copywriter for Shazeda Candles, a premium handcrafted candle brand. 
Generate product information based on user descriptions. Always respond with valid JSON only, no markdown.

Response must be a JSON object with these exact fields:
- productNames: array of 4-5 creative, elegant product name suggestions
- price: suggested price in GBP (number, typically 25-65 for candles)
- salePrice: optional sale price (number, leave out or set to null if no sale)
- category: one of "Floral", "Luxury", "Gift Set", "Seasonal"
- shortDescription: 1-2 sentence marketing tagline
- fullDescription: 3-4 paragraph detailed description (join with spaces, not newlines)
- size: candle size like "8 oz", "200g", "10 oz"
- burnTime: estimated burn time like "40-50 hours"
- scentNotes: array of 3-5 scent notes
- quote: short inspirational quote about the candle's essence

Be creative, luxurious, and evocative in your descriptions. Focus on sensory experiences and emotions.`;

/**
 * Generate product information using Azure OpenAI
 */
export const generateProductInfo = async (
  userDescription: string
): Promise<{ success: true; data: AIGeneratedProduct } | { success: false; error: AIGenerationError }> => {
  const config = getConfig();

  if (!isAzureOpenAIConfigured()) {
    return {
      success: false,
      error: {
        message: 'Azure OpenAI is not configured. Please add API credentials to .env.local',
        code: 'NOT_CONFIGURED',
      },
    };
  }

  if (!userDescription.trim()) {
    return {
      success: false,
      error: {
        message: 'Please provide a product description',
        code: 'EMPTY_DESCRIPTION',
      },
    };
  }

  const url = `${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=${config.apiVersion}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': config.apiKey,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Generate product information for: ${userDescription}` },
        ],
        temperature: 0.8,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message: errorData.error?.message || `API request failed with status ${response.status}`,
          code: 'API_ERROR',
        },
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: {
          message: 'No content received from AI',
          code: 'EMPTY_RESPONSE',
        },
      };
    }

    // Parse and validate the JSON response
    const parsed = JSON.parse(content) as AIGeneratedProduct;
    
    // Validate required fields
    if (!parsed.productNames || !Array.isArray(parsed.productNames) || parsed.productNames.length === 0) {
      throw new Error('Invalid product names in response');
    }

    return { success: true, data: parsed };
  } catch (error) {
    console.error('Azure OpenAI Error:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to generate product information',
        code: 'GENERATION_ERROR',
      },
    };
  }
};

