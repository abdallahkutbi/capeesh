import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface Book {
  _id: Id<'books'>;
  title: string;
  author?: string;
  coverImageUrl?: string;
  quizInterval: number;
  createdAt: number;
}

interface BookListProps {
  userId: string;
}

export function BookList({ userId }: BookListProps) {
  const router = useRouter();
  const books = useQuery(api.books.getByUser, { userId });

  const handleBookPress = (bookId: Id<'books'>) => {
    router.push({
      pathname: '/reader',
      params: { bookId },
    });
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookPress(item._id)}
    >
      {item.coverImageUrl ? (
        <Image
          source={{ uri: item.coverImageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Text style={styles.coverPlaceholderText}>
            {item.title.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.author && (
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.author}
          </Text>
        )}
        <Text style={styles.quizInterval}>
          Quiz every {item.quizInterval} pages
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (books === undefined) {
    return (
      <View style={styles.container}>
        <Text>Loading books...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No books yet</Text>
        <Text style={styles.emptySubtext}>
          Upload an EPUB file to get started
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      renderItem={renderBookItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 15,
  },
  coverPlaceholder: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  quizInterval: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

