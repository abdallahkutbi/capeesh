import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppleSignIn } from './useAppleSignIn';

const palette = {
  midnight: '#0d1b2a',
  deepSea: '#1b263b',
  slate: '#415a77',
  cloud: '#778da9',
  ivory: '#e0e1dd',
};

const floatingBooks = [
  { id: 'stack', emoji: '📚', position: { top: 50, left: 36 } },
  { id: 'single', emoji: '📖', position: { top: 120, right: 28 } },
  { id: 'open', emoji: '📕', position: { bottom: 220, left: 32 } },
];

function FloatingBook({
  emoji,
  position,
}: {
  emoji: string;
  position: { top?: number; right?: number; bottom?: number; left?: number };
}) {
  return (
    <View style={[styles.bookContainer, position]}>
      <Text style={styles.bookEmoji}>{emoji}</Text>
    </View>
  );
}

function BrainIcon({ size = 24, color = '#0d1b2a' }: { size?: number; color?: string }) {
  return (
    <View style={[styles.brainIconContainer, { width: size, height: size }]}>
      <View style={[styles.brainLeftHemisphere, { width: size * 0.45, height: size * 0.9, backgroundColor: color }]} />
      <View style={[styles.brainRightHemisphere, { width: size * 0.45, height: size * 0.9, backgroundColor: color }]} />
    </View>
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

  return (
    <View style={styles.background}>
      <View style={styles.gradientBlobPrimary} />
      <View style={styles.gradientBlobSecondary} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <View style={styles.orbitContainer}>
            <View style={[styles.orbit, styles.outerOrbit]} />
            <View style={[styles.orbit, styles.middleOrbit]} />
            <View style={[styles.orbit, styles.innerOrbit]} />
            <View style={styles.star}>
              <BrainIcon size={28} color={palette.slate} />
            </View>

            {floatingBooks.map((item) => (
              <FloatingBook key={item.id} {...item} />
            ))}
          </View>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.sheetHeader}>
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
              {isLoadingApple ? (
                <ActivityIndicator size="small" color={palette.deepSea} />
              ) : (
                <Text style={styles.socialText}></Text>
              )}
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
    backgroundColor: palette.ivory,
  },
  gradientBlobPrimary: {
    position: 'absolute',
    top: -120,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: palette.cloud,
    opacity: 0.35,
  },
  gradientBlobSecondary: {
    position: 'absolute',
    top: -40,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: palette.slate,
    opacity: 0.25,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  orbitContainer: {
    width: 320,
    height: 320,
    borderRadius: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbit: {
    position: 'absolute',
    borderColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    opacity: 0.8,
  },
  outerOrbit: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  middleOrbit: {
    width: 230,
    height: 230,
    borderRadius: 115,
  },
  innerOrbit: {
    width: 160,
    height: 160,
    borderRadius: 80,
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
  brainIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  brainLeftHemisphere: {
    borderRadius: 12,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  brainRightHemisphere: {
    borderRadius: 12,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 24,
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
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.midnight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: palette.ivory,
    fontSize: 20,
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



