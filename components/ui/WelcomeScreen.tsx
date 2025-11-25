import React, { useEffect, useMemo } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { BrainIcon as BrainIconSvg } from '@hugeicons/core-free-icons';
import { useRouter } from 'expo-router';
import { useAppleSignIn } from './useAppleSignIn';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  interpolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

const palette = {
  midnight: '#0d1b2a',
  deepSea: '#1b263b',
  slate: '#415a77',
  cloud: '#778da9',
  ivory: '#e0e1dd',
};

// ============================================
// ORBITAL RING CONFIGURATION
// ============================================
// Manage the books' orbital parameters here:
// - radius: Distance from brain center (in pixels). Smaller = closer orbit
//   NOTE: Emoji size is 48px, so radii should be spaced at least 60px apart to prevent overlap
// - speed: Time for one full orbit in milliseconds. Lower = faster orbit
// - initialAngle: Starting angle in degrees (0-360). 0 = top, 90 = right, 180 = bottom, 270 = left
// - emoji: The book emoji to display
// ============================================
const floatingBooks = [
  { id: 'stack', emoji: '📚', radius: 80, speed: 20000, initialAngle: 0 }, // Close, slower
  { id: 'single', emoji: '📖', radius: 140, speed: 30000, initialAngle: 72 }, // Medium, slower
  { id: 'open', emoji: '📕', radius: 200, speed: 25000, initialAngle: 144 }, // Medium-far, slower
  { id: 'notebook', emoji: '📓', radius: 260, speed: 22000, initialAngle: 216 }, // Far, slower
  { id: 'green', emoji: '📗', radius: 320, speed: 35000, initialAngle: 288 }, // Farthest, slowest
];

const ORBIT_CENTER_X = 160; // Center of 320x320 container
const ORBIT_CENTER_Y = 160;

function FloatingBook({
  emoji,
  radius,
  speed,
  initialAngle,
}: {
  emoji: string;
  radius: number;
  speed: number; // milliseconds for full orbit
  initialAngle: number; // degrees
}) {
  const isDragging = useSharedValue(false);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const animationProgress = useSharedValue(0);
  const angleOffset = useSharedValue(0); // Offset from initial angle when snapped

  // Continuous orbital animation
  useEffect(() => {
    animationProgress.value = withRepeat(
      withTiming(1, {
        duration: speed,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [speed]);

  // Calculate position from angle
  const animatedStyle = useAnimatedStyle(() => {
    if (isDragging.value) {
      // When dragging, use drag position
      return {
        transform: [
          { translateX: dragX.value + offsetX.value },
          { translateY: dragY.value + offsetY.value },
        ],
      };
    } else {
      // When orbiting, calculate from animation progress + angle offset
      const currentAngle = initialAngle + angleOffset.value + animationProgress.value * 360;
      const radians = (currentAngle * Math.PI) / 180;
      const x = Math.cos(radians) * radius;
      const y = Math.sin(radians) * radius;
      return {
        transform: [
          { translateX: x },
          { translateY: y },
        ],
      };
    }
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      // Calculate current position from orbit
      const currentAngle = initialAngle + angleOffset.value + animationProgress.value * 360;
      const radians = (currentAngle * Math.PI) / 180;
      const currentX = Math.cos(radians) * radius;
      const currentY = Math.sin(radians) * radius;
      offsetX.value = currentX;
      offsetY.value = currentY;
    })
    .onUpdate((e) => {
      dragX.value = e.translationX;
      dragY.value = e.translationY;
    })
    .onEnd(() => {
      // Calculate final position
      const finalX = dragX.value + offsetX.value;
      const finalY = dragY.value + offsetY.value;
      
      // Calculate angle from center
      const newAngle = (Math.atan2(finalY, finalX) * 180) / Math.PI;
      const normalizedAngle = ((newAngle % 360) + 360) % 360;
      
      // Calculate current orbit angle
      const currentOrbitAngle = initialAngle + angleOffset.value + animationProgress.value * 360;
      
      // Calculate the difference and update angleOffset
      let angleDiff = normalizedAngle - currentOrbitAngle;
      // Normalize to shortest path (-180 to 180)
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;
      
      // Snap to orbit by updating angleOffset
      angleOffset.value = withSpring(angleOffset.value + angleDiff, {
        damping: 15,
        stiffness: 150,
      });
      
      isDragging.value = false;
      dragX.value = withSpring(0, { damping: 15, stiffness: 150 });
      dragY.value = withSpring(0, { damping: 15, stiffness: 150 });
      offsetX.value = 0;
      offsetY.value = 0;
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.bookContainer,
          {
            position: 'absolute',
            left: ORBIT_CENTER_X,
            top: ORBIT_CENTER_Y,
          },
          animatedStyle,
        ]}
      >
        <Text style={styles.bookEmoji}>{emoji}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function BrainIcon({ size = 24, color = '#0d1b2a' }: { size?: number; color?: string }) {
  return (
    <HugeiconsIcon
      icon={BrainIconSvg}
      size={size}
      color={color}
      strokeWidth={1.5}
    />
  );
}

export function WelcomeScreen() {
  const router = useRouter();
  const { handleAppleSignIn, isLoading: isLoadingApple } = useAppleSignIn();

  const goToSignUp = (method: 'phone' | 'email') => {
    router.push({
      pathname: '/(auth)/sign-up',
      params: { method },
    });
  };

  const goToSignIn = (provider: 'google') => {
    router.push({
      pathname: '/(auth)/sign-in',
      params: { provider },
    });
  };

  const handleDismiss = () => {
    router.push('/(auth)/sign-in');
  };

  // Generate random star positions for space effect (stars appear everywhere including orbital area)
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top: Math.random() * screenHeight,
      left: Math.random() * screenWidth,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, [screenWidth, screenHeight]);

  return (
    <View style={styles.background}>
      {/* Stars for space effect */}
      {stars.map((star) => (
        <View
          key={star.id}
          style={[
            styles.spaceStar,
            {
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <View style={styles.orbitContainer}>
            <View style={styles.star}>
              <BrainIcon size={28} color={palette.midnight} />
            </View>

            {floatingBooks.map((item) => (
              <FloatingBook key={item.id} {...item} />
            ))}
          </View>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.logoContainer}>
              <HugeiconsIcon icon={BrainIconSvg} />
              <Text style={styles.logoLetter}>C</Text>
            </View>
            <View style={styles.logoMark}>
              <BrainIcon size={24} color={palette.ivory} />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss welcome screen"
              style={styles.dismissButton}
              onPress={handleDismiss}
            >
              <Text style={styles.dismissSymbol}>×</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Get Started</Text>
          <Text style={styles.subtitle}>
            Track your reading calendar, get notified about book club events, and manage what you’re
            diving into next.
          </Text>

          <Pressable style={styles.primaryButton} onPress={() => goToSignUp('phone')}>
            <Text style={styles.primaryButtonText}>Continue with Phone</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => goToSignUp('email')}>
            <Text style={styles.secondaryButtonText}>Continue with Email</Text>
          </Pressable>

          <View style={styles.socialRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              style={[styles.socialButton, isLoadingApple && styles.socialButtonDisabled]}
              onPress={handleAppleSignIn}
              disabled={isLoadingApple}
            >
              <Text style={styles.socialText}></Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              style={styles.socialButton}
              onPress={() => goToSignIn('google')}
            >
              <Text style={styles.socialText}>G</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: palette.midnight,
  },
  spaceStar: {
    position: 'absolute',
    backgroundColor: palette.ivory,
    borderRadius: 50,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 350, // Ensure orbit area stays above bottom sheet
    overflow: 'visible',
  },
  orbitContainer: {
    width: 320,
    height: 320,
    borderRadius: 160,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  star: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: palette.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.deepSea,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  bookContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookEmoji: {
    fontSize: 48,
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 0,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.midnight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: palette.midnight,
    fontSize: 20,
    fontWeight: '700',
  },
  dismissButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  dismissSymbol: {
    fontSize: 20,
    color: palette.deepSea,
    lineHeight: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: palette.midnight,
  },
  subtitle: {
    fontSize: 15,
    color: palette.slate,
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: palette.midnight,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: palette.cloud,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  secondaryButtonText: {
    color: palette.midnight,
    fontSize: 16,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  socialText: {
    fontSize: 28,
    fontWeight: '600',
    color: palette.deepSea,
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
});



