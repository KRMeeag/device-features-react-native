import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  cardContainer: {
    height: 380,
    width: "100%",
    borderRadius: 28,
    marginBottom: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardImage: {
    flex: 1,
    justifyContent: "space-between",
  },
  datePill: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    zIndex: 10,
  },
  dateText: {
    color: "#FFFFFF", // Guaranteed pure white
    fontSize: 13,
    fontWeight: "800", // Increased weight for contrast
    letterSpacing: 0.2,
  },
  gradient: {
    padding: 24,
    paddingTop: 80,
    justifyContent: "flex-end",
    flex: 1,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  locationName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  locationSub: {
    color: "#EBEBF5",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
  },
  removeButton: {
    backgroundColor: "rgba(255,59,48,0.9)",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
