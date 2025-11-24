import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  Easing,
  runOnJS
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish: () => void;
}

const LOGO_TEXT = 'capeesh';
const SUBTITLE_TEXT = 'Read. Comprehend. Retain.';

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const containerOpacity = useSharedValue(0);
  const cursorOpacity = useSharedValue(1);
  const [displayedLogo, setDisplayedLogo] = useState(LOGO_TEXT);
  const [displayedSubtitle, setDisplayedSubtitle] = useState(SUBTITLE_TEXT);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const deleteText = useCallback(() => {
    let logoChars = LOGO_TEXT.length;
    let subtitleChars = SUBTITLE_TEXT.length;
    
    deletionIntervalRef.current = setInterval(() => {
      // Delete logo characters
      if (logoChars > 0) {
        logoChars--;
        setDisplayedLogo(LOGO_TEXT.substring(0, logoChars));
      }
      
      // Delete subtitle characters after logo is partially deleted
      if (logoChars < LOGO_TEXT.length / 2 && subtitleChars > 0) {
        subtitleChars--;
        setDisplayedSubtitle(SUBTITLE_TEXT.substring(0, subtitleChars));
      }

      // When all text is deleted, fade out and finish
      if (logoChars === 0 && subtitleChars === 0) {
        if (deletionIntervalRef.current) {
          clearInterval(deletionIntervalRef.current);
          deletionIntervalRef.current = null;
        }
        containerOpacity.value = withTiming(0, {
          duration: 400,
          easing: Easing.in(Easing.ease),
        }, () => {
          runOnJS(onFinish)();
        });
      }
    }, 50); // Delete one character every 50ms for typing effect
  }, [containerOpacity, onFinish]);

  useEffect(() => {
    // Subtle fade in on entry
    containerOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    // Blinking cursor animation
    cursorOpacity.value = withRepeat(
      withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Start deletion animation after showing splash for a bit
    const deletionTimer = setTimeout(() => {
      setIsDeleting(true);
      deleteText();
    }, 2000); // Show full text for 2 seconds before deletion

    return () => {
      clearTimeout(deletionTimer);
      if (deletionIntervalRef.current) {
        clearInterval(deletionIntervalRef.current);
      }
    };
  }, [deleteText, containerOpacity, cursorOpacity]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const cursorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.content}>
        <Text style={styles.logo}>
          {displayedLogo}
          {isDeleting && displayedLogo.length > 0 && (
            <Animated.Text style={[styles.cursor, cursorAnimatedStyle]}>|</Animated.Text>
          )}
        </Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            {displayedSubtitle}
            {isDeleting && displayedSubtitle.length > 0 && displayedLogo.length === 0 && (
              <Animated.Text style={[styles.cursor, cursorAnimatedStyle]}>|</Animated.Text>
            )}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A', // Deep dark slate background
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 72,
    fontWeight: '900',
    color: '#8B5CF6', // Vibrant purple accent
    letterSpacing: 4,
    textTransform: 'lowercase',
    fontFamily: 'System',
    textShadowColor: 'rgba(139, 92, 246, 0.4)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 16,
  },
  subtitleContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#CBD5E1', // Light slate gray
    letterSpacing: 2,
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  cursor: {
    color: '#8B5CF6',
    opacity: 0.8,
  },
});

