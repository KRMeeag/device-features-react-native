import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { useTheme } from "../../contexts";
import { styles, getDynamicButtonStyle } from "./ConfirmationModal.styles";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string; // New prop
  confirmColor?: string; // New prop
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = "Confirm", // Default value
  confirmColor,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) =>
                getDynamicButtonStyle(pressed, "cancel", {
                  borderColor: colors.border,
                })
              }
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) =>
                getDynamicButtonStyle(pressed, "confirm", { confirmColor })
              }
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
