import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Linking,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts";
import { TravelCard } from "../../components/TravelCard";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import {
  styles,
  getCameraButtonStyle,
  getActionButtonStyle,
} from "./NewTravelEntry.styles";
import { TravelEntry } from "../../types";
import { useCamera } from "../../hooks/useCamera";
import { Toast } from "../../components/Toast/";

const MAX_NOTE_LENGTH = 50;

export const NewTravelEntry = () => {
  const { colors } = useTheme();
  const {
    capture,
    isProcessing: isCamProc,
    permissionError: camPermErr,
  } = useCamera();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openSettings = () => Linking.openSettings();

  // State
  const [note, setNote] = useState("");
  const [isDiscardModalVisible, setIsDiscardModalVisible] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [tempTravelEntry, setTempTravelEntry] = useState<TravelEntry | null>(
    null,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    color: "",
  });

  const showToast = (message: string, color: string = "#FF3B30") => {
    setToast({ visible: true, message, color });
  };

  const handleOpenCamera = async () => {
    // TODO: Implement expo-image-picker logic
    const photo = await capture();

    if (camPermErr || !photo) return;

    setTempTravelEntry({
      id: "preview-1",
      photo: photo,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      name: "Location Found...",
      city: "City",
      region: "Region",
      country: "Country",
      note: note,
    });
  };

  const confirmDiscardPhoto = () => {
    setTempTravelEntry(null);
    setIsDiscardModalVisible(false);
  };

  const confirmSaveEntry = () => {
    setIsSaveModalVisible(false);
    // TODO: Implement actual save logic to AsyncStorage here
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        backgroundColor={toast.color}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // 2. Android natively resizes via Expo config, forcing 'height' causes double-offsets.
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // 3. Add the precise offset. The + 20 accounts for your custom padding.
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 20 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.headerText, { color: colors.textPrimary }]}>
            Capture A Moment
          </Text>

          {camPermErr && (
            <View
              style={{
                padding: 16,
                marginBottom: 16,
                backgroundColor: colors.surface,
                borderColor: "#FF3B30",
                borderWidth: 1,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                Camera access is required to capture photos. Please enable it in
                your device settings.
              </Text>
              <Pressable
                onPress={openSettings}
                style={{
                  backgroundColor: "#FF3B30",
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  Open Settings
                </Text>
              </Pressable>
            </View>
          )}

          {!tempTravelEntry ? (
            <Pressable
              onPress={handleOpenCamera}
              style={({ pressed }) =>
                getCameraButtonStyle(pressed, colors.border, colors.surface)
              }
            >
              <View
                style={[
                  styles.cameraIconContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <Ionicons name="camera" size={32} color={colors.primary} />
              </View>
              <Text
                style={[
                  styles.cameraButtonTitle,
                  { color: colors.textPrimary },
                ]}
              >
                Take a Photo
              </Text>
              <Text
                style={[
                  styles.cameraButtonSub,
                  { color: colors.textSecondary },
                ]}
              >
                Click here to take a photo of your moment!
              </Text>
            </Pressable>
          ) : (
            <TravelCard
              item={{ ...tempTravelEntry, note }}
              onRemove={() => setIsDiscardModalVisible(true)}
            />
          )}

          <View style={styles.inputSection}>
            <View style={styles.inputHeaderRow}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                Brief Note (Optional)
              </Text>
              <Text
                style={[
                  styles.charCount,
                  {
                    color:
                      note.length >= MAX_NOTE_LENGTH
                        ? "#FF3B30"
                        : colors.textSecondary,
                  },
                ]}
              >
                {note.length} / {MAX_NOTE_LENGTH}
              </Text>
            </View>

            <Text
              style={[styles.inputSubcaption, { color: colors.textSecondary }]}
            >
              Let the image speak for itself, but if you want, have a note in{" "}
              {MAX_NOTE_LENGTH} characters or less.
            </Text>

            <Pressable
              onPress={() => {
                if (!tempTravelEntry)
                  showToast("Please take a photo before adding a note.");
              }}
            >
              <View pointerEvents={!tempTravelEntry ? "none" : "auto"}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      opacity: !tempTravelEntry ? 0.5 : 1, // Visual cue that it is disabled
                    },
                  ]}
                  editable={!!tempTravelEntry}
                  placeholder="e.g., Best sunset ever..."
                  placeholderTextColor={colors.textSecondary}
                  value={note}
                  onChangeText={setNote}
                  maxLength={MAX_NOTE_LENGTH}
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                />
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Fixed Bottom Actions - Conditionally Rendered */}
        {!isTyping && (
          <View
            style={[
              styles.footerContainer,
              {
                borderTopColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) =>
                getActionButtonStyle(pressed, "cancel", false, colors)
              }
            >
              <Text
                style={[styles.actionButtonText, { color: colors.textPrimary }]}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              // REMOVE: disabled={!tempTravelEntry}
              onPress={() => {
                if (!tempTravelEntry) {
                  showToast("Please take a photo to save this entry.");
                } else {
                  setIsSaveModalVisible(true);
                }
              }}
              style={({ pressed }) =>
                getActionButtonStyle(pressed, "save", !tempTravelEntry, colors)
              }
            >
              <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
                Save Entry
              </Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Discard Photo Modal */}
      <ConfirmationModal
        visible={isDiscardModalVisible}
        title="Discard Photo"
        message="Are you sure you want to remove this photo? You will need to take a new one."
        confirmText="Discard"
        confirmColor="#FF3B30"
        onCancel={() => setIsDiscardModalVisible(false)}
        onConfirm={confirmDiscardPhoto}
      />

      {/* Save Entry Modal */}
      <ConfirmationModal
        visible={isSaveModalVisible}
        title="Save Journal Entry"
        message="Are you sure you want to add this moment to your travel diary?"
        confirmText="Save Entry"
        confirmColor={colors.primary}
        onCancel={() => setIsSaveModalVisible(false)}
        onConfirm={confirmSaveEntry}
      />
    </SafeAreaView>
  );
};
