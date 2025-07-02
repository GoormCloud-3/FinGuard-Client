import sendFCM from '../fcm/sendFCM';

export default async function notifyUser({
  userId,
  transactionId,
  message,
}: {
  userId: string;
  transactionId: string;
  message: string;
}) {
  const mockFCMToken = 'mock_fcm_token_ABC123'; // 실제로는 DB에서 userId로 조회
  console.log(`📡 SNS 메시지 발송 - 대상: ${userId} (토큰: ${mockFCMToken})`);
  await sendFCM(mockFCMToken, message);
}