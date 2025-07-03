import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type Location =
  | {latitude: number; longitude: number}
  | null;

export async function getCurrentLocation(): Promise<Location> {
  /* 1) 위치 권한 */
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    console.warn('[Geo] 위치 권한 거부됨');
    return null;
  }

  /* 2) 현재 위치 */
  return new Promise<Location>(resolve => {
    Geolocation.getCurrentPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        resolve({latitude, longitude});
      },
      err => {
        console.warn('[Geo] 위치 오류:', err);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 10_000,
      },
    );
  });
}