import messaging from '@react-native-firebase/messaging';


// firebase 권한 요청
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

export const getFCMToken = async (): Promise<string | null> => {
  const token = await messaging().getToken();
  console.log('✅ FCM Token:', token);
  return token;
};