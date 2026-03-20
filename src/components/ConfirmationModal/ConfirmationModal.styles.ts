import { StyleSheet, Platform, ViewStyle } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  buttonBase: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonBase: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  confirmButtonBase: {
    backgroundColor: "#FF3B30", // Default fallback
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#FFFFFF",
  },
});

export const getDynamicButtonStyle = (
  pressed: boolean,
  type: "cancel" | "confirm",
  options?: { borderColor?: string; confirmColor?: string },
): ViewStyle[] => {
  const baseStyles: ViewStyle[] = [styles.buttonBase];

  if (type === "cancel") {
    baseStyles.push(styles.cancelButtonBase);
    if (options?.borderColor)
      baseStyles.push({ borderColor: options.borderColor });
  } else {
    baseStyles.push(styles.confirmButtonBase);
    // Overrides default red if a custom color is passed
    if (options?.confirmColor)
      baseStyles.push({ backgroundColor: options.confirmColor });
  }

  return [
    ...baseStyles,
    {
      opacity: pressed ? 0.6 : 1,
      transform: [{ scale: pressed ? 0.96 : 1 }],
    },
  ];
};
