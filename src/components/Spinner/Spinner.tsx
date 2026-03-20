import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../../contexts';
import { styles } from './Spinner.styles';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && (
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};