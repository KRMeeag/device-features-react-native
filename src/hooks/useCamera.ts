
import { useState } from "react"
import { CameraService } from "../services/camera.service";

export const useCamera = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [permissionError, setPermissionError] = useState(false)

    const capture = async() => {
        setIsProcessing(true);
        setPermissionError(false);
        try {
            const result = await CameraService.takePhoto();

            if (result.status === 'error_permission') {
                setPermissionError(true);
                return null;
            }

            if (result.status === 'canceled')
                return null;

            return result.uri
        } finally {
            setIsProcessing(false)
        }
    };

    return { capture, isProcessing, permissionError }
}

