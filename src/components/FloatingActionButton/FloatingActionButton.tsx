import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts';
import { styles } from './FloatingActionButton.styles';

interface FABProps {
  onPress: () => void;
}

export const FloatingActionButton = ({ onPress }: FABProps) => {
  const { colors } = useTheme();

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.fab, 
        { backgroundColor: colors.primary },
        { opacity: pressed ? 0.8 : 1 }
      ]} 
      onPress={onPress}
    >
      <Ionicons name="add" size={32} color="#FFFFFF" />
    </Pressable>
  );
};