import axios from "axios";
import { AWS_API_URL } from "@env"; 

export const sendFcmTokenToApi = async (
  token: string,
  userId: string,
  idToken?: string 
) => {
  const base = (AWS_API_URL || "").replace(/\/$/, "");
  const url = `${base}/push`;
  console.log("➡️ sending to", url);
  try {
    const res = await axios.post(
      url,
      { token, userId }, 
      {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        validateStatus: (s) => s >= 200 && s < 300,
      }
    );

    console.log(`✅ FCM 토큰 API 전송 성공: ${res.status}`, res.data);
    return true;
  } catch (err: any) {
    if (err?.response) {
      console.error("❌ API 에러:", err.response.status, err.response.data);
    } else if (err?.request) {
      console.error("❌ 네트워크 오류: 요청 보냈으나 응답 없음", err.message);
    } else {
      console.error("❌ 설정 오류:", err?.message || err);
    }
    throw err;
  }
};