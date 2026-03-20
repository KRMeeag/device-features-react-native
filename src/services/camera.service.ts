import * as ImagePicker from "expo-image-picker";

export type CameraResult =
  | { status: "success"; uri: string }
  | { status: "canceled" }
  | { status: "error_permission" };

export const CameraService = {
  async takePhoto(): Promise<CameraResult> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      console.log("Camera permission is required to take pictures.");
      return { status: "error_permission" };
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) {
      console.log("Camera cancelled.");
      return { status: "canceled" };
    }

    return { status: 'success', uri: result.assets[0].uri }
  },
};
