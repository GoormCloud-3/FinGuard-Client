import axios from "axios";
import { AWS_API_URL } from "@env";

type NotifyPayload = {
  transactionId: string; // 백엔드 송금 응답의 거래 id
  token: string;         // 저장된 FCM 토큰
  userId: string;        // userSub
};


export async function notifyTransaction(
  payload: NotifyPayload,
  idToken?: string
) {
  const base = (AWS_API_URL || "").replace(/\/$/, "");
  const url = `${base}/push/tx`;

  const res = await axios.post(url, payload, {
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    validateStatus: (s) => s >= 200 && s < 300,
  });

  return res.data;
}