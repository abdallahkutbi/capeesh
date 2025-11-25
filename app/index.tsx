import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { SplashScreen } from '../components/ui/SplashScreen';
import { WelcomeScreen } from '../components/ui/WelcomeScreen';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoaded && isSignedIn) {
    return <Redirect href="/library" />;
  }

  return <WelcomeScreen />;
}
