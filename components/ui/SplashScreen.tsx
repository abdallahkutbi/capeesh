import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';
import {
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
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

const LOGO_TEXT = 'Capeesh';
const CIRCLE_SIZE = 140;

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
  });

  const containerOpacity = useSharedValue(0);
  const cursorOpacity = useSharedValue(1);
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const [displayedLogo, setDisplayedLogo] = useState(LOGO_TEXT);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { width, height } = useWindowDimensions();

  const circleRevealScale = useMemo(() => {
    const diagonal = Math.sqrt(width * width + height * height);
    return (diagonal / CIRCLE_SIZE) + 0.4;
  }, [width, height]);

  const triggerCircleReveal = useCallback(() => {
    circleOpacity.value = 1;
    circleScale.value = withTiming(circleRevealScale, {
      duration: 650,
      easing: Easing.out(Easing.ease),
    }, () => {
      runOnJS(onFinish)();
    });
  }, [circleOpacity, circleScale, circleRevealScale, onFinish]);

  const deleteText = useCallback(() => {
    let logoChars = LOGO_TEXT.length;
    
    deletionIntervalRef.current = setInterval(() => {
      // Delete logo characters
      if (logoChars > 0) {
        logoChars--;
        setDisplayedLogo(LOGO_TEXT.substring(0, logoChars));
      }

      // When all text is deleted, fade out and finish
      if (logoChars === 0) {
        if (deletionIntervalRef.current) {
          clearInterval(deletionIntervalRef.current);
          deletionIntervalRef.current = null;
        }
        triggerCircleReveal();
      }
    }, 100); // Delete one character every 100ms for slower typing effect
  }, [triggerCircleReveal]);

  useEffect(() => {
    // Wait for fonts to load before starting animations
    if (!fontsLoaded) return;

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
  }, [fontsLoaded, deleteText, containerOpacity, cursorOpacity]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const cursorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  // Don't render until fonts are loaded to ensure font applies immediately
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.content}>
        <View style={styles.logoRow}>
          <Text style={styles.logo} allowFontScaling={false}>
            {displayedLogo}
          </Text>
          {isDeleting && displayedLogo.length > 0 && (
            <Animated.View style={[styles.cursor, cursorAnimatedStyle]} />
          )}
        </View>
      </View>
      <View style={styles.circleWrapper} pointerEvents="none">
        <Animated.View style={[styles.circle, circleAnimatedStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a', // Darkest blue-black from palette
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  logo: {
    fontSize: 72,
    fontWeight: '700',
    color: '#e0e1dd', // Brightest color from palette for maximum clarity
    letterSpacing: 2,
    fontFamily: 'DancingScript_700Bold',
    textShadowColor: 'rgba(224, 225, 221, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    includeFontPadding: false, // Android: removes extra padding for crisper text
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cursor: {
    width: 4,
    height: 62,
    marginLeft: 6,
    borderRadius: 2,
    backgroundColor: '#f4f5f0', // Slightly brighter to mimic hardware caret
  },
  circleWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#f4f5f0',
  },
});

