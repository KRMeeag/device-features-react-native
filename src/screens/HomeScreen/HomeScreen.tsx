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
import { useTheme, useTravelInfo } from "../../contexts";
import { TravelCard } from "../../components/TravelCard/";
import { SummaryCard } from "../../components/SummaryCard/";
import { FloatingActionButton } from "../../components/FloatingActionButton/";
import { LoadingSpinner } from "../../components/Spinner";
import { ConfirmationModal } from "../../components/ConfirmationModal"; // Import Modal
import { styles } from "./HomeScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/";

export const HomeScreen = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const { logs, saveLog, loading, deleteLog } = useTravelInfo();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Modal State
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Triggered when trash icon on TravelCard is pressed
  const promptDelete = (id: string) => {
    setSelectedEntryId(id);
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedEntryId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedEntryId) {
      deleteLog(selectedEntryId);
      console.log(`Deleting entry: ${selectedEntryId}`);
    }

    // Close and reset
    setIsDeleteModalVisible(false);
    setSelectedEntryId(null);
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

      {/* Conditional Rendering: Spinner vs FlatList */}
      {loading ? (
        <LoadingSpinner message="Loading memories..." />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <SummaryCard count={logs.length} />
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
            <TravelCard item={item} onRemove={promptDelete} />
          )}
        />
      )}

      <FloatingActionButton
        onPress={() => navigation.navigate("NewTravelEntry")}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={isDeleteModalVisible}
        title="Delete Memory"
        message="Are you sure you want to delete this memory? This action cannot be undone."
        confirmText="Delete"
        confirmColor="#FF3B30" // Destructive red
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
};
