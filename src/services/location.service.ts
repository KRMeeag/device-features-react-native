import * as Location from "expo-location";
import { Address } from "../types";

export type LocationResult =
  | { status: "success"; data: Address }
  | { status: "error_permission" }
  | { status: "error_fetch" };

  export const LocationService = {
    async getCurrentLocation(): Promise<LocationResult> {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            console.log('Location permission is required.')
            return { status: 'error_permission' };
        }

        try {
            const locationData = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });

            const { latitude, longitude } = locationData.coords;

            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });

            const address = reverseGeocode[0];

            return {
                status: 'success',
                data: {
                    name: address?.name ?? 'Unknown Location',
                    city: address?.city ?? 'Unknown City',
                    region: address?.region ?? 'Unknown Region',
                    country: address?.country ?? 'Unknown Country'
                }
            }
        } catch (error) {
            console.error('Error fetching location or geocoding:', error);
            return { status: 'error_fetch'};
        }
    }
  }