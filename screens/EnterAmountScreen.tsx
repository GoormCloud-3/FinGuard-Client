import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useCurrentLocation } from '../src/useCurrentLocation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EnterAmount'>;
type RouteProps = RouteProp<RootStackParamList, 'EnterAmount'>;

export default function EnterAmountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { fromAccountId, toAccountId } = route.params;

  const API = 'http://10.0.2.2:4000';
  const [fromAccount, setFromAccount] = useState<any>(null);
  const [toAccount, setToAccount] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const location = useCurrentLocation();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const fromRes = await fetch(`${API}/accounts/${fromAccountId}`);
        const toRes = await fetch(`${API}/accounts/${toAccountId}`);
        setFromAccount(await fromRes.json());
        setToAccount(await toRes.json());
      } catch (err) {
        console.error(err);
        Alert.alert('계좌 정보 오류', '계좌 정보를 불러올 수 없습니다.');
      }
    };

    fetchAccounts();
  }, [fromAccountId, toAccountId, navigation]);

  const handleKeyPress = (key: string) => {
    if (key === '←') {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      const next = amount + key;
      const numeric = Number(next.replace(/,/g, ''));

      if (fromAccount && numeric > fromAccount.balance) {
        Alert.alert('잔액이 부족합니다.');
        setAmount('');
        return;
      }

      setAmount(next);
    }
  };

  const handleSend = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('금액을 입력해주세요.');
      return;
    }

    try {
      // 잔액 업데이트
      await fetch(`${API}/accounts/${fromAccountId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: fromAccount.balance - numericAmount }),
      });

      await fetch(`${API}/accounts/${toAccountId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: toAccount.balance + numericAmount }),
      });

      // 거래 내역 추가
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const sendTx = {
        accountId: fromAccountId,
        title: `${toAccount.name} 송금`,
        time,
        amount: -numericAmount,
      };

      const receiveTx = {
        accountId: toAccountId,
        title: `${fromAccount.name} 입금`,
        time,
        amount: numericAmount,
      };

      await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendTx),
      });

      await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiveTx),
      });

      // 7️⃣ SQS 등록용 API 호출 (이상 거래 테스트)
      if (location) {
        await fetch(`${API}/anomaly-sqs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: `tx-${Date.now()}`, // 테스트용 고유 ID
            toAccountId,
            location,
            userId: 'user-1234', // 예시 사용자 ID
          }),
        });
      }

      Alert.alert('송금 완료', `${numericAmount.toLocaleString()}원을 송금했습니다.`);
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
      Alert.alert('오류', '송금 중 문제가 발생했습니다.');
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>←</BackText>
        </BackButton>
      </Header>

      {fromAccount && toAccount && (
        <>
          <Title>{fromAccount.name} 계좌에서</Title>
          <BalanceText>잔액 {fromAccount.balance.toLocaleString()}원</BalanceText>

          <SubTitle>{toAccount.name} 계좌로</SubTitle>
          <AccountNumber>{toAccount.number}</AccountNumber>

          <Prompt>{amount ? '보낼 금액' : '얼마나 보낼까요?'}</Prompt>
          <AmountBox>₩ {Number(amount || '0').toLocaleString()}</AmountBox>

          <KeypadContainer>
            {['1','2','3','4','5','6','7','8','9','00','0','←'].map((key) => (
              <KeypadButton key={key} onPress={() => handleKeyPress(key)}>
                <KeypadText>{key}</KeypadText>
              </KeypadButton>
            ))}
          </KeypadContainer>

          <SendButton onPress={handleSend}>
            <SendButtonText>송금</SendButtonText>
          </SendButton>
        </>
      )}
    </Container>
  );
}
// ===== 스타일 컴포넌트 =====
const Container = styled.ScrollView`
  flex: 1;
  background-color: #121212;
  padding: 24px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 12px;
`;

const BackText = styled.Text`
  color: #ffffff;
  font-size: 36px;
`;

const Title = styled.Text`
  color: #ffffff;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const BalanceText = styled.Text`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 18px;
`;

const SubTitle = styled.Text`
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 4px;
  font-weight: bold;
`;

const AccountNumber = styled.Text`
  color: #ccc;
  font-size: 14px;
  margin-bottom: 24px;
`;

const Prompt = styled.Text`
  color: #999;
  font-size: 18px;
  margin-bottom: 6px;
`;

const AmountBox = styled.Text`
  color: #ffffff;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 32px;
`;

const KeypadContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const KeypadButton = styled.TouchableOpacity`
  width: 30%;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  background-color: #1e1e1e;
  border-radius: 12px;
`;

const KeypadText = styled.Text`
  color: #ffffff;
  font-size: 26px;
`;

const SendButton = styled.TouchableOpacity`
  margin-top: 24px;
  background-color: #007aff;
  padding: 18px;
  border-radius: 12px;
  align-items: center;
`;

const SendButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;
