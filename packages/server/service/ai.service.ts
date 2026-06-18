import OpenAI from 'openai';
import summarizePrompt from '../prompts/summarize-reviews.txt'

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

const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
    async getLLMResponse({
        model = 'gpt-5.4-mini',
        prompt,
        temperature = 0.2,
        maxTokens = 500
    }: GenerateTextOption): Promise<LLMResponse> {
        const response = await openAIClient.responses.create({
            model,
            input: prompt,
            temperature,
            instructions: summarizePrompt,
            max_output_tokens: maxTokens,
        });

        return { id: response.id, content: response.output_text };
    },
};
