import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useMutation } from 'convex/react';
import { useAuth } from '@clerk/expo';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface BookUploadProps {
  onUploadComplete?: (bookId: Id<'books'>) => void;
}

export function BookUpload({ onUploadComplete }: BookUploadProps) {
  const { userId } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const storeFile = useMutation(api.storage.storeEPUB);
  const createBook = useMutation(api.books.create);

  const handleUpload = async () => {
    if (!userId) {
      Alert.alert('Error', 'You must be signed in to upload books');
      return;
    }

    try {
      setIsUploading(true);

      // Pick EPUB file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsUploading(false);
        return;
      }

      const file = result.assets[0];
      if (!file) {
        throw new Error('No file selected');
      }

      // For now, we'll create the book record
      // In a full implementation, you'd:
      // 1. Upload file to Convex storage
      // 2. Parse EPUB to extract metadata
      // 3. Create book record with metadata

      // TODO: Implement actual file upload to Convex storage
      // const storageId = await uploadFileToConvex(file);
      
      // For now, using a placeholder
      Alert.alert(
        'Upload',
        'EPUB file upload is not yet fully implemented. File storage integration needed.'
      );

      // Placeholder book creation (will fail without proper storage)
      // const bookId = await createBook({
      //   userId,
      //   title: file.name.replace(/\.epub$/i, ''),
      //   epubFileId: storageId,
      //   epubFileName: file.name,
      //   quizInterval: 5,
      // });

      // if (onUploadComplete) {
      //   onUploadComplete(bookId);
      // }

      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading book:', error);
      Alert.alert(
        'Upload Failed',
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
        onPress={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload EPUB Book</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.helpText}>
        Select an EPUB file from your device to add it to your library
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

