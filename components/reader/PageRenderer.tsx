import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Page } from '@/lib/epub/paginator';

interface PageRendererProps {
  page: Page;
  theme?: 'light' | 'dark' | 'sepia';
  fontSize?: number;
  lineHeight?: number;
}

export function PageRenderer({
  page,
  theme = 'light',
  fontSize = 18,
  lineHeight = 1.6,
}: PageRendererProps) {
  const { width, height } = Dimensions.get('window');
  const padding = 20;
  const contentWidth = width - padding * 2;

  const themeStyles = getThemeStyles(theme);

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={[styles.content, { width: contentWidth }]}>
        <Text style={[styles.chapterTitle, themeStyles.text]}>
          {page.chapterTitle}
        </Text>
        <Text
          style={[
            styles.text,
            themeStyles.text,
            { fontSize, lineHeight: fontSize * lineHeight },
          ]}
        >
          {page.content}
        </Text>
      </View>
    </View>
  );
}

function getThemeStyles(theme: 'light' | 'dark' | 'sepia') {
  switch (theme) {
    case 'dark':
      return {
        container: { backgroundColor: '#1a1a1a' },
        text: { color: '#e0e0e0' },
      };
    case 'sepia':
      return {
        container: { backgroundColor: '#f4ecd8' },
        text: { color: '#5c4a37' },
      };
    default: // light
      return {
        container: { backgroundColor: '#ffffff' },
        text: { color: '#000000' },
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    textAlign: 'left',
  },
});

