
import { KAKAO_API_KEY } from '@env';

// 두 지점간 거리 계산
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
export const getCoordinatesFromAddress = async (address: string) => {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
      },
    }
  );

  const data = await response.json();
  if (data.documents && data.documents.length > 0) {
    const location = data.documents[0].address;
    return {
      latitude: location.y,
      longitude: location.x,
    };
  } else {
    throw new Error('주소로부터 좌표를 찾을 수 없습니다.');
  }
};