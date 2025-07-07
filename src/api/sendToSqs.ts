import axios from 'axios';

/**
 * 거래 내역을 SQS에 전송
 * @param data 거래 정보 객체
 */
export const sendTransactionToSqs = async (data: any) => {
  try {
    const response = await axios.post(
      'SQS 엔드포인트 입력', // sqs 엔드포인트 필요
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200) {
      console.log('✅ SQS 등록 성공');
    } else {
      console.warn('⚠️ SQS 등록 실패:', response.data);
    }
  } catch (error: any) {
    console.error('❌ SQS 전송 실패:', error.response?.data || error.message);
  }
};