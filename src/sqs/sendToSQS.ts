export type FraudPayload = {
  transactionId: string;
  receiverAccountId: string;
  senderUid: string;
  location: { latitude: number; longitude: number };
};

const SQS_API_BASE = 'http://10.0.2.2:4000'; // Android 에뮬레이터용 base URL

export const sendToSQS = async (payload: FraudPayload) => {
  try {
    const response = await fetch(`${SQS_API_BASE}/sqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`SQS 등록 실패 (${response.status}): ${errorBody}`);
    }

    const result = await response.json();
    console.log('✅ SQS 등록 완료:', result);
  } catch (err) {
    console.error('❌ SQS 등록 실패:', err);
  }
};
