import React, { useState, useEffect } from "react";
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
  AppState,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useTheme, useTravelInfo } from "../../contexts";
import { TravelCard } from "../../components/TravelCard";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { LoadingSpinner } from "../../components/Spinner";
import {
  styles,
  getCameraButtonStyle,
  getActionButtonStyle,
} from "./NewTravelEntry.styles";
import { TravelEntry } from "../../types";
import { useCamera } from "../../hooks/useCamera";
import { Toast } from "../../components/Toast/";
import { useLocation } from "../../hooks/useLocation";
import { DateUtil } from "../../utils/date.utils";
import uuid from "react-native-uuid";
import { useNotifications } from "../../hooks/useNotifications";

const MAX_NOTE_LENGTH = 50;

export const NewTravelEntry = () => {
  const { colors } = useTheme();
  const { capture, isProcessing: isCamProc } = useCamera();
  const { fetchLocation, isLocating } = useLocation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { saveLog } = useTravelInfo();

  // Aliased permissionError to avoid conflict with camera hooks if needed later
  const {
    expoPushToken,
    permissionError: notifPermErr,
    isSimulator,
    sendNotification,
  } = useNotifications();

  // Initialization States
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasAllPermissions, setHasAllPermissions] = useState(false);

  // Form States
  const [note, setNote] = useState("");
  const [tempTravelEntry, setTempTravelEntry] = useState<TravelEntry | null>(
    null,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    color: "",
  });

  // Modal States
  const [isDiscardModalVisible, setIsDiscardModalVisible] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
  const [isSimModalVisible, setIsSimModalVisible] = useState(false);

  const showToast = (message: string, color: string = "#FF3B30") => {
    setToast({ visible: true, message, color });
  };

  const openSettings = () => Linking.openSettings();

  useEffect(() => {
    const checkPermissions = async () => {
      setIsInitializing(true);
      try {
        const camRes = await ImagePicker.requestCameraPermissionsAsync();
        const locRes = await Location.requestForegroundPermissionsAsync();

        if (camRes.status === "granted" && locRes.status === "granted") {
          setHasAllPermissions(true);
        } else {
          setHasAllPermissions(false);
        }
      } catch (error) {
        console.error("Error requesting permissions:", error);
        setHasAllPermissions(false);
      } finally {
        setIsInitializing(false);
      }
    };

    checkPermissions();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleOpenCamera = async () => {
    const photo = await capture();
    if (!photo) return;

    const location = await fetchLocation();
    if (!location) {
      showToast("Could not determine your location. Please try again.");
      return;
    }

    setTempTravelEntry({
      id: uuid.v4().toString(),
      photo: photo,
      date: DateUtil.getFormattedDateToday(),
      name: location.name,
      city: location.city,
      region: location.region,
      country: location.country,
      note: note,
    });
  };

  const confirmDiscardPhoto = () => {
    setTempTravelEntry(null);
    setNote("");
    setIsDiscardModalVisible(false);
  };

  const confirmSaveEntry = async () => {
    setIsSaveModalVisible(false);

    // Save to local storage first
    if (tempTravelEntry) {
      await saveLog({ ...tempTravelEntry, note });
    }

    // Process Notification Pipeline
    if (isSimulator) {
      setIsSimModalVisible(true);
    } else if (notifPermErr) {
      setIsNotifModalVisible(true);
    } else {
      await sendNotification(
        "Memory Added!",
        `You have successfully added a new photo from ${tempTravelEntry?.city}!`,
      );
      navigation.goBack();
    }
  };

  // Notification Modal Handlers
  const handleNotifModalClose = () => {
    setIsNotifModalVisible(false);
    navigation.goBack();
  };

  const handleNotifModalSettings = () => {
    setIsNotifModalVisible(false);
    openSettings();
    navigation.goBack(); // Navigates back underlying UI before opening settings
  };

  const handleSimModalClose = () => {
    setIsSimModalVisible(false);
    navigation.goBack();
  };

  const isLoadingAction = isCamProc || isLocating;

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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

          {isInitializing ? (
            <View
              style={[
                styles.cameraButtonBase,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <LoadingSpinner message="Checking permissions..." />
            </View>
          ) : !hasAllPermissions ? (
            <View
              style={{
                padding: 20,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 16,
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Ionicons
                name="lock-closed"
                size={48}
                color={colors.textSecondary}
                style={{ marginBottom: 16 }}
              />
              <Text
                style={{
                  color: colors.textPrimary,
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                Access Required
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  textAlign: "center",
                  lineHeight: 22,
                  marginBottom: 24,
                }}
              >
                Momentify needs access to your Camera and Location to securely
                capture and map your memories.
              </Text>

              <Pressable
                onPress={openSettings}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}
                >
                  Open Device Settings
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              {isLoadingAction ? (
                <View
                  style={[
                    styles.cameraButtonBase,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    },
                  ]}
                >
                  <LoadingSpinner
                    message={
                      isLocating
                        ? "Finding your location..."
                        : "Processing photo..."
                    }
                  />
                </View>
              ) : tempTravelEntry ? (
                <TravelCard
                  item={{ ...tempTravelEntry, note }}
                  onRemove={() => setIsDiscardModalVisible(true)}
                />
              ) : (
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
              )}

              <View style={styles.inputSection}>
                <View style={styles.inputHeaderRow}>
                  <Text
                    style={[styles.inputLabel, { color: colors.textPrimary }]}
                  >
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
                  style={[
                    styles.inputSubcaption,
                    { color: colors.textSecondary },
                  ]}
                >
                  Let the image speak for itself, but if you want, have a note
                  in {MAX_NOTE_LENGTH} characters or less.
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
                          opacity: !tempTravelEntry ? 0.5 : 1,
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
            </>
          )}
        </ScrollView>

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
                getActionButtonStyle(
                  pressed,
                  hasAllPermissions ? "cancel" : "save",
                  false,
                  colors,
                )
              }
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: hasAllPermissions ? colors.textPrimary : "#FFFFFF" },
                ]}
              >
                {hasAllPermissions ? "Cancel" : "Go Back"}
              </Text>
            </Pressable>

            {hasAllPermissions && (
              <Pressable
                onPress={() => {
                  if (!tempTravelEntry) {
                    showToast("Please take a photo to save this entry.");
                  } else {
                    setIsSaveModalVisible(true);
                  }
                }}
                style={({ pressed }) =>
                  getActionButtonStyle(
                    pressed,
                    "save",
                    !tempTravelEntry,
                    colors,
                  )
                }
              >
                <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
                  Save Entry
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Core Operational Modals */}
      <ConfirmationModal
        visible={isDiscardModalVisible}
        title="Discard Photo"
        message="Are you sure you want to remove this photo? You will need to take a new one."
        confirmText="Discard"
        confirmColor="#FF3B30"
        onCancel={() => setIsDiscardModalVisible(false)}
        onConfirm={confirmDiscardPhoto}
      />

      <ConfirmationModal
        visible={isSaveModalVisible}
        title="Save Journal Entry"
        message="Are you sure you want to add this moment to your travel diary?"
        confirmText="Save Entry"
        confirmColor={colors.primary}
        onCancel={() => setIsSaveModalVisible(false)}
        onConfirm={confirmSaveEntry}
      />

      {/* Notification Flow Modals */}
      <ConfirmationModal
        visible={isNotifModalVisible}
        title="Notifications Off"
        message="We noticed notifications are disabled. Enable them in settings to receive alerts when your memories are successfully uploaded."
        cancelText="Not Now"
        confirmText="Go to Settings"
        confirmColor={colors.primary}
        onCancel={handleNotifModalClose}
        onConfirm={handleNotifModalSettings}
      />

      <ConfirmationModal
        visible={isSimModalVisible}
        title="Simulator Detected"
        message="We noticed that you're not on an actual smartphone. No notifications will be pushed."
        cancelText="Dismiss"
        confirmText="Understood"
        confirmColor={colors.primary}
        onCancel={handleSimModalClose}
        onConfirm={handleSimModalClose}
      />
    </SafeAreaView>
  );
};
