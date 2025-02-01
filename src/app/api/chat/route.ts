// app/api/teach/route.ts
import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
const MODEL = 'mistralai/Mistral-Nemo-Instruct-2407';

export async function POST(req: Request) {
  try {
    const { message, conversationHistory, studentLevel } = await req.json();
    
    const systemPrompt = `
        You are a Python tutor for kids. Follow STRICTLY:
        1. Use 1-2 short sentences before code examples
        2. Explain concepts using emojis + simple words
        3. Follow this structure:
            - 1 compliment/positive emoji
            - Clear instruction
            - Code example
            - 1 interactive question
        4. Max 3 bullet points per response
        5. Avoid long explanations - learn by doing

        Student level: ${studentLevel || 'beginner'}
        Current conversation context:
        ${conversationHistory.slice(-3).map((m: any) => m.content).join('\n')}
        `;

    const response = await hf.textGeneration({
      model: MODEL,
      inputs: `[INST] ${systemPrompt}\nStudent: ${message} [/INST]`,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
        repetition_penalty: 1.3,
        return_full_text: false
      }
    });

    // Post-process the response
    const tutorResponse = formatResponse(response.generated_text);
    const containsExercise = tutorResponse.includes('**Exercise**');
    
    return NextResponse.json({ 
      response: tutorResponse,
      exercise: containsExercise ? extractExercise(tutorResponse) : null
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Learning session failed. Please try again!' },
      { status: 500 }
    );
  }
}

// Helpers to structure the response
function formatResponse(text: string): string {
  return text
    .replace(/```python/g, '🌟 Code Example:\n```python')
    .replace(/```/g, '')
    .replace(/\*\*Exercise\*\*/g, '🏆 Challenge Time!');
}

function extractExercise(text: string): string {
  const exerciseMatch = text.split('🏆 Challenge Time!')[1];
  return exerciseMatch ? exerciseMatch.trim() : '';
}