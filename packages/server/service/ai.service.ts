import OpenAI from 'openai';
import summarizePrompt from '../prompts/summarize-reviews.txt'
import { Ollama } from 'ollama';

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

const ollamaClient = new Ollama();

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

    // in case there is a local LLM like tinyllama
    async getLocalLLMResponse(prompt: string) {
        const response = await ollamaClient.chat({
            model: 'tinyllama',
            messages: [
                {
                    role: 'system',
                    content: summarizePrompt
                },
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        return response.message.content;
    }
};
