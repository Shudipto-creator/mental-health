import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const FALLBACK_RESPONSES = [
  "I'm here to listen and support you. Would you like to tell me more about what's on your mind?",
  "That sounds challenging. Could you help me understand how you're feeling about this?",
  "I hear you. It's important to acknowledge these feelings. What kind of support would be most helpful right now?",
  "Thank you for sharing that with me. Would you like to explore these thoughts further?",
  "Your feelings are valid. Let's take a moment to process this together. What do you think would be a good next step?",
];

function getRandomFallbackResponse(): string {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

export async function generateAIResponse(
  message: string,
  sessionId: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an empathetic mental health assistant. Your goal is to:
            - Listen actively and show understanding
            - Provide emotional support
            - Ask thoughtful questions to better understand the user's situation
            - Offer gentle guidance and coping strategies when appropriate
            - Maintain a warm, supportive tone
            - Never give medical advice or diagnoses
            - Encourage professional help when needed`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0].message.content || getRandomFallbackResponse();
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    if (error?.error?.type === 'insufficient_quota' || error?.error?.code === 'insufficient_quota') {
      return "I apologize, but I'm currently experiencing technical difficulties. Please know that your mental health is important, and I encourage you to reach out to a counselor or mental health professional for support.";
    }
    return getRandomFallbackResponse();
  }
}