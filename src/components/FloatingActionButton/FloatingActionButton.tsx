import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts';
import { styles } from './FloatingActionButton.styles';

interface FABProps {
  onPress: () => void;
}

export const FloatingActionButton = ({ onPress }: FABProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.fab, { backgroundColor: colors.primary }]} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name="add" size={32} color="#FFFFFF" />
    </TouchableOpacity>
  );
};