import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SendMoney'>;

type Account = {
  id: string;
  name: string;
  number: string;
  balance: number;
};

const accounts: Account[] = [
  { id: '1', name: 'Finguard 통장', number: '1000123456789', balance: 1234567 },
  { id: '2', name: '우리은행', number: '1028374650912', balance: 180000 },
  { id: '3', name: 'IBK 통장', number: '1234567890123', balance: 102345 },
  { id: '4', name: '입출금통장', number: '9876543210001', balance: 50 },
];

export default function SendMoneyScreen({ route }: any) {
  const navigation = useNavigation<NavigationProp>();
  const { fromAccountId } = route.params;

  const handleSelect = (toAccountId: string) => {
    if (fromAccountId === toAccountId) {
      Alert.alert('오류', '같은 계좌로 송금할 수 없습니다.');
      return;
    }

    navigation.navigate('EnterAmount', { fromAccountId, toAccountId });
  };

  return (
    <Container>
      <Title>어느 계좌로 보낼까요?</Title>
      {accounts.map((account) => (
        <AccountItem key={account.id} onPress={() => handleSelect(account.id)}>
          <AccountName>{account.name}</AccountName>
          <AccountNumber>{account.number}</AccountNumber>
        </AccountItem>
      ))}
    </Container>
  );
}

// ===== 스타일 컴포넌트 =====
const Container = styled.ScrollView`
  flex: 1;
  background-color: #121212;
  padding: 24px;
`;

const Title = styled.Text`
  color: #ffffff;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const AccountItem = styled.TouchableOpacity`
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const AccountName = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

const AccountNumber = styled.Text`
  color: #999999;
  font-size: 14px;
  margin-top: 4px;
`;
