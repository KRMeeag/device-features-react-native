import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TravelEntry } from "../../types";
import { useTheme } from "../../contexts";
import { styles } from "./TravelCard.styles";

interface TravelCardProps {
  item: TravelEntry;
  onRemove?: (id: string) => void;
}

export const TravelCard = ({ item, onRemove }: TravelCardProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.surface }]}>
      <ImageBackground
        source={{ uri: item.photo }}
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
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              activeOpacity={0.8}
              onPress={() => onRemove && onRemove(item.id)}
            >
              <Ionicons name="trash" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};
