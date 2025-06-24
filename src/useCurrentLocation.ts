// 현재 위치 정보 가져오는 함수
// 화면이 처음 로드될 때 자동으로 현재 위치 받아옴
import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

type Location = {
  latitude: number;
  longitude: number;
} | null;

export const useCurrentLocation = (): Location => {
  const [location, setLocation] = useState<Location>(null);

  useEffect(() => {
    const requestPermissionAndGetLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => console.warn('위치 오류:', error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestPermissionAndGetLocation();
  }, []);

  return location;
};
