import React, { useState, useRef } from "react";
import { View, Text, FlatList, Pressable, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TravelEntry } from "../../types";
import { useTheme, useTravelInfo } from "../../contexts";
import { TravelCard } from "../../components/TravelCard/";
import { SummaryCard } from "../../components/SummaryCard/";
import { FloatingActionButton } from "../../components/FloatingActionButton/";
import { LoadingSpinner } from "../../components/Spinner";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Toast } from "../../components/Toast/";
import { styles } from "./HomeScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/";

export const HomeScreen = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const { logs, saveLog, loading, deleteLog } = useTravelInfo();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Refs
  const flatListRef = useRef<FlatList<TravelEntry>>(null);

  // States
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    color: "",
  });

  const showToast = (message: string, color: string = "#FF3B30") => {
    setToast({ visible: true, message, color });
  };

  const promptDelete = (id: string) => {
    setSelectedEntryId(id);
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedEntryId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedEntryId) {
      await deleteLog(selectedEntryId);
      showToast("Memory deleted successfully.", "#34C759"); // Standard success green
    }

    setIsDeleteModalVisible(false);
    setSelectedEntryId(null);

    // Scroll to the top of the feed
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
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

      <Toast
        visible={toast.visible}
        message={toast.message}
        backgroundColor={toast.color}
        onHide={() => setToast({ ...toast, visible: false })}
      />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerSpacer} />
        <Text style={[styles.appName, { color: colors.textPrimary }]}>
          Momentify
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.themeToggle,
            { opacity: pressed ? 0.2 : 1 },
          ]}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
      </View>

      {loading ? (
        <LoadingSpinner message="Loading memories..." />
      ) : (
        <FlatList
          ref={flatListRef}
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

      <ConfirmationModal
        visible={isDeleteModalVisible}
        title="Delete Memory"
        message="Are you sure you want to delete this memory? This action cannot be undone."
        confirmText="Delete"
        confirmColor="#FF3B30"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
};
