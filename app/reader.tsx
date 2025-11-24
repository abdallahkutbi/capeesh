import { View, Text, StyleSheet } from 'react-native';

export default function Reader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reader</Text>
      <Text style={styles.placeholder}>Reader screen - To be implemented</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
