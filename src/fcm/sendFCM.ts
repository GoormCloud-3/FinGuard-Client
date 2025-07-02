export default async function sendFCM(token: string, message: string) {
  console.log('📨 FCM 발송 요청');
  console.log('🧾 대상 토큰:', token);
  console.log('📝 메시지:', message);

  // 실제로는 FCM 서버에 요청
  await new Promise(res => setTimeout(res, 500));
  console.log('✅ FCM 발송 완료');
}