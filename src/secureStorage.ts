import * as Keychain from 'react-native-keychain';

/**
 * FCM 토큰 저장
 */
export const saveFcmToken = async (token: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword('fcm', token, {
      service: 'fcm_token',
    });
    return true;
  } catch (error) {
    console.error('[SecureStorage] FCM 저장 실패:', error);
    return false;
  }
};

/**
 * FCM 토큰 가져오기
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: 'fcm_token' });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('[SecureStorage] FCM 가져오기 실패:', error);
    return null;
  }
};

/**
 * FCM 토큰 삭제
 */
export const deleteFcmToken = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: 'fcm_token' });
  } catch (error) {
    console.warn('[SecureStorage] FCM 삭제 실패:', error);
  }
};