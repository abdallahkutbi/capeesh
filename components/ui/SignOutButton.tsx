import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { View } from 'react-native';
import { Button } from './button';

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL('/'));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="mt-5">
      <Button variant="destructive" onPress={handleSignOut}>
        Sign out
      </Button>
    </View>
  );
};

