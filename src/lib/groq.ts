// Fallback responses in case of errors
const FALLBACK_RESPONSES = [
  "I'm here to listen and support you. Would you like to tell me more about what's on your mind?",
  "That sounds challenging. Could you help me understand how you're feeling about this?",
  "I hear you. It's important to acknowledge these feelings. What kind of support would be most helpful right now?",
  "Thank you for sharing that with me. Would you like to explore these thoughts further?",
  "Your feelings are valid. Let's take a moment to process this together. What do you think would be a good next step?",
];

// Get a random fallback response
function getRandomFallbackResponse(): string {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

// Groq API configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Interface for chat messages
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// System prompt for the mental health assistant
const SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content: `You are an empathetic mental health assistant. Your goal is to:
  - Listen actively and show understanding
  - Provide emotional support
  - Ask thoughtful questions to better understand the user's situation
  - Offer gentle guidance and coping strategies when appropriate
  - Maintain a warm, supportive tone
  - Never give medical advice or diagnoses
  - Encourage professional help when needed`
};

// Interface for message history records from database
interface MessageRecord {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

/**
 * Generate an AI response using Groq's Llama3 model
 * 
 * @param message User's latest message
 * @param sessionId Current chat session ID
 * @param previousMessages Optional array of previous messages for context
 * @returns AI generated response
 */
export async function generateAIResponse(
  message: string,
  sessionId: string,
  previousMessages: MessageRecord[] = []
): Promise<string> {
  try {
    // Start with the system prompt
    const messages: ChatMessage[] = [SYSTEM_PROMPT];
    
    // Add previous messages for context (limited to last 10 messages)
    const recentMessages = previousMessages.slice(-10);
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });
    
    // Add the current user message
    messages.push({ role: 'user', content: message });
    
    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages,
        temperature: 0.7,
        max_tokens: 200,
        top_p: 0.9
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error details:', errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0]?.message?.content || getRandomFallbackResponse();
  } catch (error) {
    console.error('Error generating AI response:', error);
    return getRandomFallbackResponse();
  }
} 