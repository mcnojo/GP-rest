import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text: string): Promise<number[]> {
    const res = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
    });
    return res.data[0].embedding as number[];
}
