import OpenAI from 'openai';
import type { ChatResponse } from '../model/ChatResponse';

// To be more flexible regarding LLP provider (Anthropic, OpenAI, Google)
type GenerateTextOption = {
    model?: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
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
    }: GenerateTextOption): Promise<ChatResponse> {
        const response = await client.responses.create({
            model,
            input: prompt,
            temperature,
            max_output_tokens: maxTokens,
        });

        return { id: response.id, content: response.output_text };
    },
};
