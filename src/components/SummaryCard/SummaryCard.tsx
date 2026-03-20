import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts';
import { styles } from './SummaryCard.styles';

interface SummaryCardProps {
  count: number;
}

export const SummaryCard = ({ count }: SummaryCardProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Memories Captured</Text>
      <Text style={[styles.count, { color: colors.textPrimary }]}>{count}</Text>
    </View>
  );
};