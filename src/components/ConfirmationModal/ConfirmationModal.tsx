import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { useTheme } from "../../contexts";
import { styles, getDynamicButtonStyle } from "./ConfirmationModal.styles";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
  cancelText?: string; // New
  cancelColor?: string; // New
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  confirmColor,
  cancelText = "Cancel", // Default
  cancelColor,
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
                  cancelColor,
                  borderColor: colors.border,
                })
              }
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: cancelColor || colors.textPrimary },
                ]}
              >
                {cancelText}
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
