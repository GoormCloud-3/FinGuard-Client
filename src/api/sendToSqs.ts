// import axios from 'axios';

// // Lambda Function URL (SQS 등록용 Lambda)
// const lambdaFunctionUrl =
//   'https://cuawti5joabliw4q64yxfhsjfu0ilpte.lambda-url.ap-northeast-2.on.aws/';

// /**
//  * 거래 내역을 SQS에 전송
//  * @param data 거래 정보 객체
//  */
// export const sendTransactionToSqs = async (data: any) => {
//   try {
//     const response = await axios.post(lambdaFunctionUrl, data, {
//       headers: { 'Content-Type': 'application/json' },
//     });

//     if (response.status === 200) {
//       console.log('✅ SQS 등록 성공', response.data);
//     } else {
//       console.warn('⚠️ SQS 등록 실패:', response.data);
//     }
//   } catch (error: any) {
//     console.error('❌ SQS 전송 실패:', error.response?.data || error.message);
//   }
// };