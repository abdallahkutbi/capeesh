import OpenAI from 'openai';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

export interface GeneratedQuiz {
  questions: QuizQuestion[];
}

const DEFAULT_QUESTION_COUNT = 3;

/**
 * Generate comprehension quiz questions from text using OpenAI
 */
export async function generateQuiz(
  text: string,
  apiKey: string,
  questionCount: number = DEFAULT_QUESTION_COUNT
): Promise<GeneratedQuiz> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // For React Native, consider using a backend proxy
  });

  const prompt = `You are an educational assistant. Generate ${questionCount} multiple-choice comprehension questions based on the following text. Each question should test understanding of the content, not just recall. Make questions challenging but fair.

Text:
${text}

Format your response as a JSON array of questions, where each question has:
- "question": the question text
- "options": an array of 4 answer options
- "correctAnswer": the index (0-3) of the correct answer

Example format:
[
  {
    "question": "What is the main theme?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1
  }
]

Return ONLY the JSON array, no other text.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for cost efficiency
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at creating educational comprehension questions. Always return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || '[]';
    
    // Clean the response (remove markdown code blocks if present)
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const questions: QuizQuestion[] = JSON.parse(cleanedResponse);

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid quiz format returned from API');
    }

    // Validate each question
    for (const question of questions) {
      if (
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        typeof question.correctAnswer !== 'number' ||
        question.correctAnswer < 0 ||
        question.correctAnswer > 3
      ) {
        throw new Error('Invalid question format');
      }
    }

    return { questions };
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error(
      `Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate quiz using Anthropic Claude (alternative to OpenAI)
 */
export async function generateQuizWithAnthropic(
  text: string,
  apiKey: string,
  questionCount: number = DEFAULT_QUESTION_COUNT
): Promise<GeneratedQuiz> {
  // This would require @anthropic-ai/sdk
  // For now, we'll use OpenAI as the default
  throw new Error('Anthropic integration not yet implemented');
}

