import axios from 'axios';

// 임시 위도경도 계산 로직. 아직 제대로 구현 못함..
export const getCoordinatesFromAddress = async (address) => {
  const apiKey = 'YOUR_GOOGLE_API_KEY';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${apiKey}`;

  const response = await axios.get(url);
  const location = response.data.results?.[0]?.geometry?.location;

  if (!location) throw new Error('위치 정보를 찾을 수 없습니다.');

  return {
    latitude: location.lat.toString(),
    longitude: location.lng.toString(),
  };
};
