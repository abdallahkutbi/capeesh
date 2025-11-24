import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { SplashScreen } from '../components/ui/SplashScreen';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for minimum duration even if auth loads quickly
    if (isLoaded && !showSplash) {
      // Auth loaded and splash finished, ready to redirect
    }
  }, [isLoaded, showSplash]);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // After splash, check auth state
  if (!isLoaded) {
    return null; // Still loading auth
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/library" />;
}
