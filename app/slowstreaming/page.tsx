import { Suspense } from "react";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { OpenAIStream } from "ai";
import json from "../longtext.json";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function askForFeedback(title: string, content: string) {
    let messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content:
                "You are a Swizec's editor. He wrote a new article and is looking for your feedback.",
        },
        {
            role: "system",
            content: `The article's title is: ${title}`,
        },
        {
            role: "system",
            content: `The article's content is: ${content}`,
        },
        {
            role: "user",
            content:
                "Suggest editorial improvements I can make so the article delivers its core insight more clearly and better engages readers. Respond in short bullet points formatted as markdown",
        },
    ];

    const feedback = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.6,
        max_tokens: 800,
        stream: true,
    });

    return feedback;
}

const SlowStreamingComponent = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const feedback = await askForFeedback(
        "Async React with NextJS 13",
        json.longtext
    );
    const stream = OpenAIStream(feedback);

    return (
        <>
            This will timeout, but only when deployed 👇
            <br />
            Notice it stops streaming after 15s no matter what. Even in the
            middle of a sentence.
            <br />
            Search param to prevent static build: {searchParams.rand}
            <br />
            <br />
            <AIStreamReader reader={stream.getReader()} />
        </>
    );
};

async function AIStreamReader({
    reader,
}: {
    reader: ReadableStreamDefaultReader<any>;
}) {
    const { done, value } = await reader.read();

    if (done) {
        return null;
    }

    const text = new TextDecoder().decode(value);

    return (
        <>
            {text}
            {text.includes("\n") ? (
                <>
                    <br />
                    <br />
                </>
            ) : null}
            <Suspense>
                <AIStreamReader reader={reader} />
            </Suspense>
        </>
    );
}

export default SlowStreamingComponent;
