import { coreFetch } from './coreFetch';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type OpenAiResponse = {
  choices: { message: { content: string } }[];
};

/**
 * OpenAI Chat Completions API를 raw fetch로 호출한다.
 * JSON mode를 사용하여 구조화된 응답을 받는다.
 */
export const openAiFetch = async (
  messages: ChatMessage[],
  model: string = 'gpt-4o',
): Promise<string> => {
  const response = await coreFetch<OpenAiResponse>(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    },
    30_000,
  );

  return response.choices[0].message.content;
};
