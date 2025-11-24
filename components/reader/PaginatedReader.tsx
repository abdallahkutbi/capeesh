import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Text,
} from 'react-native';
import { PageRenderer } from './PageRenderer';
import { Page } from '@/lib/epub/paginator';

interface PaginatedReaderProps {
  pages: Page[];
  initialPage?: number;
  onPageChange?: (pageIndex: number) => void;
  theme?: 'light' | 'dark' | 'sepia';
  fontSize?: number;
  lineHeight?: number;
  onQuizTrigger?: (pageIndex: number) => void;
  quizInterval?: number;
  pagesReadSinceLastQuiz?: number;
}

const SWIPE_THRESHOLD = 50;
const { width } = Dimensions.get('window');

export function PaginatedReader({
  pages,
  initialPage = 0,
  onPageChange,
  theme = 'light',
  fontSize = 18,
  lineHeight = 1.6,
  onQuizTrigger,
  quizInterval = 5,
  pagesReadSinceLastQuiz = 0,
}: PaginatedReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
  const [translateX] = useState(new Animated.Value(0));
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPageIndex);
    }
  }, [currentPageIndex, onPageChange]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isNavigating,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: () => {
      translateX.setOffset(translateX._value);
      translateX.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      translateX.flattenOffset();

      if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD) {
        if (gestureState.dx > 0) {
          // Swipe right - previous page
          goToPreviousPage();
        } else {
          // Swipe left - next page
          goToNextPage();
        }
      } else {
        // Snap back to center
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1 && !isNavigating) {
      setIsNavigating(true);
      
      // Check if we need to trigger a quiz
      const newPagesRead = pagesReadSinceLastQuiz + 1;
      if (newPagesRead >= quizInterval && onQuizTrigger) {
        onQuizTrigger(currentPageIndex + 1);
        setIsNavigating(false);
        return;
      }

      Animated.timing(translateX, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentPageIndex(currentPageIndex + 1);
        translateX.setValue(0);
        setIsNavigating(false);
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0 && !isNavigating) {
      setIsNavigating(true);
      Animated.timing(translateX, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentPageIndex(currentPageIndex - 1);
        translateX.setValue(0);
        setIsNavigating(false);
      });
    }
  };

  const currentPage = pages[currentPageIndex];
  const progress = ((currentPageIndex + 1) / pages.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.reader} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.pageContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          {currentPage && (
            <PageRenderer
              page={currentPage}
              theme={theme}
              fontSize={fontSize}
              lineHeight={lineHeight}
            />
          )}
        </Animated.View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.pageInfo}>
          {currentPageIndex + 1} / {pages.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reader: {
    flex: 1,
    overflow: 'hidden',
  },
  pageContainer: {
    flex: 1,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#e0e0e0',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  footer: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  pageInfo: {
    fontSize: 12,
    color: '#666',
  },
});

