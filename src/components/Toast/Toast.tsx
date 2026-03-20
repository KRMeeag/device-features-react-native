import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { styles } from './Toast.styles';

interface ToastProps {
  visible: boolean;
  message: string;
  backgroundColor?: string;
  textColor?: string;
  onHide: () => void;
  duration?: number;
}

export const Toast = ({
  visible,
  message,
  backgroundColor = '#333333',
  textColor = '#FFFFFF',
  onHide,
  duration = 3000,
}: ToastProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
        ]).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, opacity, translateY, duration, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};