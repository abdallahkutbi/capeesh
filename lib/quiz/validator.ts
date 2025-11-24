import { QuizQuestion } from './generator';

export interface QuizResult {
  score: number; // Percentage (0-100)
  correctAnswers: number;
  totalQuestions: number;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionIndex: number;
  isCorrect: boolean;
  userAnswer: number;
  correctAnswer: number;
}

/**
 * Validate quiz answers and calculate score
 */
export function validateQuizAnswers(
  questions: QuizQuestion[],
  userAnswers: number[]
): QuizResult {
  if (userAnswers.length !== questions.length) {
    throw new Error('Number of answers does not match number of questions');
  }

  const questionResults: QuestionResult[] = questions.map((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;

    return {
      questionIndex: index,
      isCorrect,
      userAnswer,
      correctAnswer: question.correctAnswer,
    };
  });

  const correctAnswers = questionResults.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;
  const score = (correctAnswers / totalQuestions) * 100;

  return {
    score,
    correctAnswers,
    totalQuestions,
    questionResults,
  };
}

