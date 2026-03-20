import React from "react";
import { View, Text, Pressable, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TravelEntry } from "../../types";
import { useTheme } from "../../contexts";
import { styles, getRemoveButtonStyle } from "./TravelCard.styles";

interface TravelCardProps {
  item: TravelEntry;
  onRemove?: (id: string) => void;
}

export const TravelCard = ({ item, onRemove }: TravelCardProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.surface }]}>
      <ImageBackground
        source={{ uri: item.photo ?? undefined }}
        style={styles.cardImage}
        resizeMode="cover"
      >
        <View style={styles.datePill}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
          style={styles.gradient}
        >
          <View style={styles.contentRow}>
            <View style={styles.textContainer}>
              <Text style={styles.locationName} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={styles.locationSub} numberOfLines={2}>
                {item.city}, {item.region} • {item.country}
              </Text>

              {/* Note conditionally rendered below location data */}
              {!!item.note && (
                <Text style={styles.noteText} numberOfLines={2}>
                  "{item.note}"
                </Text>
              )}
            </View>

            {/* Trash button hidden if onRemove logic is not passed (e.g., standard view mode) */}
            {onRemove && (
              <Pressable
                style={({ pressed }) => getRemoveButtonStyle(pressed)}
                onPress={() => onRemove(item.id)}
              >
                <Ionicons name="trash" size={20} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};
