'use client';

import { useState, useEffect } from 'react';

export interface UserLocation {
    latitude: number;
    longitude: number;
}

export function useLocation() {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        const handleSuccess = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setLoading(false);
        };

        const handleError = (error: GeolocationPositionError) => {
            setError(error.message);
            setLoading(false);
        };

        // Get initial position
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

        // Watch position for real-time updates
        const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return { location, error, loading };
}
