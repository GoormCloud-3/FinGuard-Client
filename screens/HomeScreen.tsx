import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Account = {
  id: string;
  name: string;
  balance: number;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const API = 'http://10.0.2.2:4000';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${API}/accounts`);
        const data = await res.json();
        setAccounts(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <Container>
      <Title>내 계좌</Title>
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          onPress={() => navigation.navigate('AccountDetail', { accountId: account.id })}
        >
          <AccountName>{account.name}</AccountName>
          <Balance>{account.balance.toLocaleString()}원</Balance>
        </AccountCard>
      ))}

      <CreateButton onPress={() => navigation.navigate('CreateAccount')}>
        <CreateButtonText>➕ 새 통장 만들기</CreateButtonText>
      </CreateButton>
    </Container>
  );
}

// 스타일 컴포넌트
const Container = styled.ScrollView`
  flex: 1;
  background-color: #121212;
  padding: 24px;
`;

const Title = styled.Text`
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const AccountCard = styled.TouchableOpacity`
  background-color: #1e1e1e;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const AccountName = styled.Text`
  color: #aaa;
  font-size: 14px;
`;

const Balance = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 20px;
`;

const CreateButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
