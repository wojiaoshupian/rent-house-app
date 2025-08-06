import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Step {
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

interface StepGuideProps {
  title: string;
  steps: Step[];
  backgroundColor?: string;
}

export const StepGuide: React.FC<StepGuideProps> = ({
  title,
  steps,
  backgroundColor = '#f0f9ff'
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: step.color || '#3b82f6' }]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  {step.icon && `${step.icon} `}{step.title}
                </Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
            
            {index < steps.length - 1 && (
              <View style={styles.stepConnector} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  stepsContainer: {
    paddingLeft: 8,
  },
  stepItem: {
    position: 'relative',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  stepConnector: {
    position: 'absolute',
    left: 13,
    top: 28,
    width: 2,
    height: 16,
    backgroundColor: '#d1d5db',
  },
});
