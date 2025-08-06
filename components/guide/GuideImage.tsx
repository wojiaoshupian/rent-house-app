import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface GuideImageProps {
  title: string;
  description?: string;
  imagePath?: string;
  placeholder?: string;
  aspectRatio?: number;
}

export const GuideImage: React.FC<GuideImageProps> = ({
  title,
  description,
  imagePath,
  placeholder = '📱',
  aspectRatio = 16 / 9
}) => {
  const imageWidth = screenWidth - 60; // 考虑padding
  const imageHeight = imageWidth / aspectRatio;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={[styles.imageContainer, { width: imageWidth, height: imageHeight }]}>
        {imagePath ? (
          <Image
            source={{ uri: imagePath }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>{placeholder}</Text>
            <Text style={styles.placeholderText}>示例界面</Text>
            <Text style={styles.placeholderSubtext}>（实际使用时显示真实界面）</Text>
          </View>
        )}
      </View>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  imageContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});
