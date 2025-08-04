import { KAKAO_API_KEY } from '@env';

// 두 지점간 거리 계산 (Haversine 공식)
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// 주소 → 좌표 변환 함수
export const getCoordinatesFromAddress = async (
  address: string
): Promise<{ latitude: number; longitude: number }> => {
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`응답 실패: ${response.status}`);
    }

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const location = data.documents[0].address;

      if (!location?.x || !location?.y) {
        throw new Error('좌표 정보가 없습니다.');
      }

      return {
        latitude: parseFloat(location.y),
        longitude: parseFloat(location.x),
      };
    } else {
      throw new Error('주소로부터 좌표를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('주소 변환 실패:', error);
    throw new Error('좌표 변환 중 오류가 발생했습니다.');
  }
};