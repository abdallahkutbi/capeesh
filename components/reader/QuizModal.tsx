import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { QuizQuestion } from '@/lib/quiz/generator';
import { validateQuizAnswers, QuizResult } from '@/lib/quiz/validator';

interface QuizModalProps {
  visible: boolean;
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
  onRetry?: () => void;
  isLoading?: boolean;
}

export function QuizModal({
  visible,
  questions,
  onComplete,
  onRetry,
  isLoading = false,
}: QuizModalProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset state when modal opens
    if (visible) {
      setSelectedAnswers(new Array(questions.length).fill(-1));
      setCurrentQuestionIndex(0);
      setQuizResult(null);
      setIsSubmitting(false);
    }
  }, [visible, questions.length]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (selectedAnswers.some((answer) => answer === -1)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    const result = validateQuizAnswers(questions, selectedAnswers);
    setQuizResult(result);
    setIsSubmitting(false);
  };

  const handleContinue = () => {
    if (quizResult) {
      onComplete(quizResult);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];

  if (isLoading) {
    return (
      <Modal visible={visible} animationType="fade" transparent={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Generating quiz questions...</Text>
        </View>
      </Modal>
    );
  }

  if (quizResult) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={styles.container}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Quiz Complete!</Text>
            <Text style={styles.resultScore}>
              Score: {quizResult.score.toFixed(0)}%
            </Text>
            <Text style={styles.resultDetails}>
              {quizResult.correctAnswers} out of {quizResult.totalQuestions}{' '}
              questions correct
            </Text>

            <ScrollView style={styles.resultsList}>
              {quizResult.questionResults.map((result, index) => (
                <View
                  key={index}
                  style={[
                    styles.resultItem,
                    result.isCorrect ? styles.correct : styles.incorrect,
                  ]}
                >
                  <Text style={styles.resultQuestion}>
                    Q{index + 1}: {questions[index].question}
                  </Text>
                  <Text style={styles.resultAnswer}>
                    Your answer: {questions[index].options[result.userAnswer]}
                  </Text>
                  {!result.isCorrect && (
                    <Text style={styles.correctAnswerText}>
                      Correct answer:{' '}
                      {questions[index].options[result.correctAnswer]}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.buttonRow}>
              {onRetry && (
                <TouchableOpacity
                  style={[styles.button, styles.retryButton]}
                  onPress={onRetry}
                >
                  <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.continueButton]}
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>Continue Reading</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Comprehension Quiz ({currentQuestionIndex + 1} / {questions.length})
          </Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    currentAnswer === index && styles.optionSelected,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      currentAnswer === index && styles.optionTextSelected,
                    ]}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.navButton,
                currentQuestionIndex === 0 && styles.buttonDisabled,
              ]}
              onPress={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleNext}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {currentQuestionIndex === questions.length - 1
                  ? 'Submit'
                  : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 15,
  },
  option: {
    padding: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f2ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    backgroundColor: '#e0e0e0',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  continueButton: {
    backgroundColor: '#34C759',
  },
  retryButton: {
    backgroundColor: '#FF9500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 10,
  },
  resultDetails: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  resultsList: {
    flex: 1,
    marginBottom: 20,
  },
  resultItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
  },
  correct: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  incorrect: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  resultQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultAnswer: {
    fontSize: 14,
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
});

