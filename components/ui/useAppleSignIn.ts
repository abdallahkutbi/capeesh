import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '@clerk/clerk-expo';

export function useAppleSignIn() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleSignIn = async () => {
    // Check if Apple Authentication is available (only on iOS)
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign In is only available on iOS');
    }

    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple Sign In is not available on this device');
    }

    try {
      setIsLoading(true);

      // Step 1: Get Apple identity token using native API
      // This will show the native "Sign in with Apple" UI on real devices
      // On simulator, it may show a web-based prompt (this is expected behavior)
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received from Apple');
      }

      // Step 2: Send the identity token to Clerk's backend API
      // Note: This requires a backend endpoint to securely verify the token with Clerk
      // For now, we'll use Clerk's OAuth flow, but you should create a backend endpoint
      // that accepts the identity token and verifies it with Clerk's API
      
      // TODO: Replace this with a call to your backend endpoint that verifies the token
      // Example: const response = await fetch('YOUR_BACKEND_URL/api/auth/apple', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ identityToken: credential.identityToken })
      // });
      
      // For now, we'll log that we need a backend endpoint
      console.warn(
        'Native Apple Sign In requires a backend endpoint to verify the identity token with Clerk. ' +
        'Please create an API endpoint that accepts the identity token and uses Clerk\'s REST API to authenticate the user.'
      );
      
      // Temporary: This will still trigger web OAuth, but on a real device,
      // the native flow above will have already shown the native UI
      // You should replace this with your backend endpoint call
      throw new Error(
        'Backend endpoint required. Please implement an API endpoint to verify the Apple identity token with Clerk.'
      );
    } catch (err: any) {
      // Handle user cancellation - don't show error for cancellation
      if (
        err.code === 'ERR_CANCELED' ||
        err.code === 'ERR_REQUEST_CANCELED' ||
        err.code === 'ERR_REQUEST_INTERRUPTED'
      ) {
        return;
      }
      
      console.error('Apple Sign In error', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleAppleSignIn,
    isLoading,
  };
}

