import { ClerkProvider } from '@clerk/expo';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

const convexClient = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL || ''
);

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
      >
        <ConvexProvider client={convexClient}>
          <Slot />
        </ConvexProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
