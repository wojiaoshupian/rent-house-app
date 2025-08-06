import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress?: () => void;
  buttonText?: string;
  features?: string[];
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color,
  onPress,
  buttonText = '了解更多',
  features = []
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      
      {features.length > 0 && (
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      )}
      
      {onPress && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: color }]}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  featureBullet: {
    fontSize: 14,
    color: '#9ca3af',
    marginRight: 8,
    marginTop: 1,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
