const detectFraud = require('../sagemaker/detectFraud');
const notifyUser = require('../sns/notifyUser');

const mockSQSMessage = {
  transactionId: 't999',
  receiverAccountId: '2',
  senderUid: 'user123',
  location: { latitude: 37.5, longitude: 126.9 },
};

async function main() {
  console.log('🔄 Lambda 트리거됨...');
  const result = await detectFraud(mockSQSMessage);

  if (result.isFraud) {
    await notifyUser({
      transactionId: mockSQSMessage.transactionId,
      userId: mockSQSMessage.senderUid,
      message: `🚨 위법 거래가 감지되었습니다. 거래번호: ${mockSQSMessage.transactionId}`,
    });
  } else {
    console.log('✅ 정상 거래로 판단됨.');
  }
}

main();