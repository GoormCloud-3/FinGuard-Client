import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { accountData as bankAccounts } from '../src/accountData';
import { accountData as userAccounts } from '../src/userAccountData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EnterAmount'>;
type RouteProps = RouteProp<RootStackParamList, 'EnterAmount'>;

export default function EnterAmountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { fromAccountId, toAccountId } = route.params;

  const fromAccount = userAccounts[fromAccountId as keyof typeof userAccounts];
  const toAccount = bankAccounts[toAccountId as keyof typeof bankAccounts];

  const [amount, setAmount] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === '←') {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      const nextAmount = amount + key;
      const numeric = Number(nextAmount.replace(/,/g, ''));

      if (numeric > fromAccount.balance) {
        Alert.alert('잔액이 부족합니다.');
        setAmount('');
        return;
      }

      setAmount(nextAmount);
    }
  };

  const handleSend = () => {
    if (!amount || Number(amount) === 0) {
      Alert.alert('금액을 입력해주세요.');
      return;
    }

    Alert.alert('송금 완료', `${Number(amount).toLocaleString()}원을 송금했습니다.`);
    navigation.navigate('Home');
  };

  return (
    <Container>
      <Header>
        <BackButton
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate('SendMoney', { fromAccountId })
          }
        >
          <BackText>←</BackText>
        </BackButton>
      </Header>

      <Title>{fromAccount?.name} 계좌에서</Title>
      <BalanceText>잔액 {fromAccount?.balance.toLocaleString()}원</BalanceText>

      <SubTitle>{toAccount?.name} 계좌로</SubTitle>
      <AccountNumber>{toAccount?.number}</AccountNumber>

      <Prompt>얼마나 보낼까요?</Prompt>
      <AmountBox>₩ {Number(amount || '0').toLocaleString()}</AmountBox>

      <KeypadContainer>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '←'].map((key) => (
          <KeypadButton key={key} onPress={() => handleKeyPress(key)}>
            <KeypadText>{key}</KeypadText>
          </KeypadButton>
        ))}
      </KeypadContainer>

      <SendButton onPress={handleSend}>
        <SendButtonText>송금</SendButtonText>
      </SendButton>
    </Container>
  );
}

// 스타일 컴포넌트
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
