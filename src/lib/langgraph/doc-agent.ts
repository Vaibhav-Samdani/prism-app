import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const DocState = Annotation.Root({
  content: Annotation<string>(),
  result: Annotation<string>(),
});

async function rewriteNode(state: typeof DocState.State) {
  const llm = new ChatOpenAI({
    modelName: "openrouter/free",
    // Pass the key directly to the apiKey field, not configuration
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
    temperature: 0.7,
  });

  const sysMsg = new SystemMessage(
    "You are an expert technical editor and content strategist. " +
    "Your goal is to rewrite and improve the provided document content. " +
    "1. Structure the content with clear H1, H2, and H3 headings. " +
    "2. Improve clarity, flow, and professional tone. " +
    "3. Use bullet points for readability where appropriate. " +
    "4. Return ONLY valid HTML (no markdown). Do not include wrappers like ```html."
  );

  const humanMsg = new HumanMessage(
    `Rewrite and structure this document content: \n\n${state.content}`
  );

  const response = await llm.invoke([sysMsg, humanMsg]);
  let cleanHtml = response.content as string;
  cleanHtml = cleanHtml.replace(/```html/gi, "").replace(/```/g, "").trim();

  return { result: cleanHtml };
}

const workflow = new StateGraph(DocState)
  .addNode("rewrite", rewriteNode)
  .addEdge(START, "rewrite")
  .addEdge("rewrite", END);

export const docAgent = workflow.compile();

export async function rewriteDocument(content: string) {
  const finalState = await docAgent.invoke({ content, result: "" });
  return finalState.result;
}