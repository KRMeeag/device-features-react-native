import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TravelEntry } from "../../types";
import { useTheme } from "../../contexts";
import { TravelCard } from "../../components/TravelCard/";
import { SummaryCard } from "../../components/SummaryCard/";
import { FloatingActionButton } from "../../components/FloatingActionButton/";
import { styles } from "./HomeScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/";

// Inject mock data here or via Context/Props depending on your data layer
const MOCK_DATA: TravelEntry[] = [{
    id: '1',
    photo: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop',
    date: 'Oct 12, 2023',
    name: 'Eiffel Tower',
    city: 'Paris',
    region: 'Île-de-France',
    country: 'France',
  },
  {
    id: '2',
    photo: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2000&auto=format&fit=crop',
    date: 'Jan 05, 2024',
    name: 'Marina Bay Sands',
    city: 'Downtown Core',
    region: 'Central',
    country: 'Singapore',
  },
  {
    id: '3',
    photo: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2000&auto=format&fit=crop',
    date: 'Mar 20, 2024',
    name: 'Sydney Opera House',
    city: 'Sydney',
    region: 'New South Wales',
    country: 'Australia',
  },
]; // Set to empty to trigger fallback state

export const HomeScreen = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const [entries, setEntries] = useState<TravelEntry[]>(MOCK_DATA);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleRemove = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
        No Memories Yet
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
        Tap the + button below to add your first travel entry.
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.appName, { color: colors.textPrimary }]}>
          Momentify
        </Text>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <SummaryCard count={entries.length} />
            <View style={styles.listHeaderContainer}>
              <Text
                style={[styles.listHeaderText, { color: colors.textPrimary }]}
              >
                Memories
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <TravelCard item={item} onRemove={handleRemove} />
        )}
      />
      <FloatingActionButton
        onPress={() => navigation.navigate("NewTravelEntry")}
      />
    </SafeAreaView>
  );
};
