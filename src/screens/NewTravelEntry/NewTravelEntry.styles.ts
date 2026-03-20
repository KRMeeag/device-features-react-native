import { StyleSheet, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
    letterSpacing: -0.5,
  },

  // Camera Button Styles
  cameraButtonBase: {
    height: 380,
    width: "100%",
    borderRadius: 28,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  cameraIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  cameraButtonTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  cameraButtonSub: {
    fontSize: 14,
    fontWeight: "400",
  },

  // Input Styles
  inputSection: {
    marginTop: 8,
  },
  inputHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  charCount: {
    fontSize: 13,
    fontWeight: "500",
  },
  inputSubcaption: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  // Footer Actions
  footerContainer: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 32, // Accommodates safe area on devices without physical home buttons
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionButtonBase: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonBase: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  saveButtonBase: {
    // Background color applied dynamically
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export const getCameraButtonStyle = (
  pressed: boolean,
  borderColor: string,
  backgroundColor: string,
): ViewStyle[] => [
  styles.cameraButtonBase,
  {
    borderColor,
    backgroundColor,
    opacity: pressed ? 0.7 : 1,
    transform: [{ scale: pressed ? 0.98 : 1 }],
  },
];

export const getActionButtonStyle = (
  pressed: boolean,
  type: "cancel" | "save",
  disabled: boolean,
  colors: { border: string; primary: string; surface: string },
): ViewStyle[] => {
  const baseStyles: ViewStyle[] = [styles.actionButtonBase];

  if (type === "cancel") {
    baseStyles.push(styles.cancelButtonBase);
    baseStyles.push({ borderColor: colors.border });
  } else {
    baseStyles.push(styles.saveButtonBase);
    baseStyles.push({
      backgroundColor: disabled ? colors.border : colors.primary,
    });
  }

  return [
    ...baseStyles,
    {
      opacity: pressed && !disabled ? 0.7 : disabled ? 0.5 : 1,
      transform: [{ scale: pressed && !disabled ? 0.96 : 1 }],
    },
  ];
};
