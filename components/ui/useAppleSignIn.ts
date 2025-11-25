import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOAuth } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-expo';

export function useAppleSignIn() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });
  const { setActive } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive: setActiveFromOAuth } = await startOAuthFlow();

      if (createdSessionId) {
        // If we have setActive from OAuth, use it; otherwise use the hook's setActive
        if (setActiveFromOAuth) {
          await setActiveFromOAuth({ session: createdSessionId });
        } else {
          await setActive({ session: createdSessionId });
        }
        router.replace('/library');
      }
    } catch (err: any) {
      console.error('OAuth error', err);
      // Handle error - you might want to show an error message to the user
      throw err; // Re-throw so caller can handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleAppleSignIn,
    isLoading,
  };
}

