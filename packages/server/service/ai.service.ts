import OpenAI from 'openai';

// To be more flexible regarding LLP provider (Anthropic, OpenAI, Google)
type GenerateTextOption = {
    model?: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
};

type LLMResponse = {
    id: string;
    content: string;
};

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
    async getLLMResponse({
        model = 'gpt-5.4-mini',
        prompt,
        temperature = 0.2,
        maxTokens = 500,
    }: GenerateTextOption): Promise<LLMResponse> {
        const response = await client.responses.create({
            model,
            input: prompt,
            temperature,
            max_output_tokens: maxTokens,
        });

        return { id: response.id, content: response.output_text };
    },
};
