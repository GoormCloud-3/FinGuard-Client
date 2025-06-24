// 현재 사용자 정보에 등록된 위치 정보 가져오기
import { fetchUserAttributes } from 'aws-amplify/auth';

export const getCurrentUserLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const attributes = await fetchUserAttributes(); 

    const latStr = attributes['custom:latitude'];
    const lonStr = attributes['custom:longitude'];

    if (!latStr || !lonStr) {
      console.warn('위치 정보가 등록되지 않았습니다.');
      return null;
    }

    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lonStr);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn('위치 정보가 유효하지 않습니다.');
      return null;
    }

    return { latitude, longitude };
  } catch (error) {
    console.error('사용자 위치 정보 가져오기 실패:', error);
    return null;
  }
};
