import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;

const formatUserData = (data) => {
    if (!data) return "";

    const {
        name, surname, title, email, phone, location,
        about, skillsSection, timelineData, projects
    } = data;

    let context = `
  You are an AI assistant for the portfolio website of ${name} ${surname}.
  Your goal is to answer questions about ${name} based ONLY on the provided data.
  
  PROFILE:
  Name: ${name} ${surname}
  Title: ${title}
  Location: ${location}
  Email: ${email}
  Phone: ${phone}
  
  ABOUT:
  ${about?.description || ""}
  
  EXPERIENCE & EDUCATION:
  ${timelineData?.map(item =>
        `- ${item.type.toUpperCase()}: ${item.title || item.degree} at ${item.company || item.institution} (${item.period}). ${item.description}`
    ).join('\n')}
  
  PROJECTS:
  ${projects?.map(p =>
        `- ${p.title}: ${p.description} (Tags: ${p.tags?.join(', ')})`
    ).join('\n')}
  
  SKILLS:
  ${JSON.stringify(data.skillGroups)}
  `;

    return context;
};

export const generateResponse = async (query, userData, chatHistory = []) => {
    if (!API_KEY) {
        return "Error: VITE_GEMINI_KEY is not set in the environment variables.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });

        const systemPrompt = formatUserData(userData);

        // Construct the conversation history
        const contents = [
            {
                role: 'user',
                parts: [{ text: systemPrompt + "\n\nIMPORTANT: Answer the following question based on the above context. If the answer is not in the context, say you don't know." }]
            },
            {
                role: 'model',
                parts: [{ text: "Understood. I am ready to answer questions about the portfolio." }]
            },
            ...chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            {
                role: 'user',
                parts: [{ text: query }]
            }
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: contents
        });

        return response.text;
    } catch (error) {
        console.error("Error generating response:", error);
        return "Sorry, I encountered an error while processing your request. Please check the API Key or try again later.";
    }
};
