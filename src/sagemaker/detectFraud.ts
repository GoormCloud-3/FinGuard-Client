import { FraudPayload } from '../sqs/sendToSQS';

export default async function detectFraud(payload: FraudPayload): Promise<{ isFraud: boolean }> {
  // 위치 거리, 계좌번호, 금액 등 분석 후 판단 (현재는 무작위)
  console.log('🧠 SageMaker 분석 요청...');
  await new Promise(res => setTimeout(res, 1000)); // 시뮬레이션 지연

  const suspicious = payload.transactionId.endsWith('9'); // 예시 로직
  return { isFraud: suspicious };
}