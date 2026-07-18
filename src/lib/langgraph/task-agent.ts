import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// 1. Define the LangGraph State
export const AgentState = Annotation.Root({
  title: Annotation<string>(),
  description: Annotation<string>(),
  result: Annotation<string>(),
});

// 2. Define the Generation Node
async function generateBulletsNode(state: typeof AgentState.State) {
  // Using OpenRouter to route to openrouter/free (or any other model)
  const llm = new ChatOpenAI({
    modelName: "openrouter/free",
    // Pass the key directly to the apiKey field, not configuration
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    },
    temperature: 0.7,
  });

  // const llm = new ChatGoogleGenerativeAI({
  //   model: "gemini-1.5-flash",
  //   apiKey: process.env.GOOGLE_API_KEY, // Set this in your .env
  //   temperature: 0.7,
  // });

  const sysMsg = new SystemMessage(
    "You are an expert technical project manager. Return ONLY valid HTML. Do not wrap it in markdown blockquotes like ```html.",
  );

  const humanMsg = new HumanMessage(
    `Based on this task title: "${state.title}" and existing description context: "${state.description}", generate exactly 3 concise, highly actionable sub-tasks or requirements as bullet points. Format the output strictly as an HTML unordered list (<ul><li>...</li></ul>).`,
  );

  const response = await llm.invoke([sysMsg, humanMsg]);

  // Clean up any potential markdown formatting the LLM might hallucinate
  let cleanHtml = response.content as string;
  cleanHtml = cleanHtml
    .replace(/```html/gi, "")
    .replace(/```/g, "")
    .trim();

  return { result: cleanHtml };
}

// 3. Compile the LangGraph Workflow
const workflow = new StateGraph(AgentState)
  .addNode("generateBullets", generateBulletsNode)
  .addEdge(START, "generateBullets")
  .addEdge("generateBullets", END);

export const taskAgent = workflow.compile();

// 4. Export a clean helper function for your API routes to use
export async function generateTaskBullets(
  title: string,
  description: string = "",
) {
  const finalState = await taskAgent.invoke({
    title,
    description,
    result: "",
  });

  return finalState.result;
}
