import { useState } from "react";
import { Address } from "../types";
import { LocationService } from "../services/location.service";

export const useLocation = () => {
  const [isLocating, setIsLocating] = useState(false);
  const [locPermError, setLocPermError] = useState(false);
  const [locFetchError, setLocFetchError] = useState(false);

  const fetchLocation = async (): Promise<Address | null> => {
    setIsLocating(false);
    setLocPermError(false);
    setLocFetchError(false);

    try {
      const result = await LocationService.getCurrentLocation();

      if (result.status === "error_permission") {
        setLocPermError(true);
        return null;
      }

      if (result.status === "error_fetch") {
        setLocFetchError(true);
        return null;
      }

      return result.data;
    } finally {
        setIsLocating(false);
    }
  };

  return { fetchLocation, isLocating, locPermError, locFetchError }
};
