import React from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  setIsLoggedIn: (value: boolean) => void;
};

type Account = {
  id: string;
  name: string;
  balance: number;
};

const mockAccounts: Account[] = [
  { id: '1', name: '토스뱅크 통장', balance: 0 },
  { id: '2', name: '저축예금', balance: 1927132 },
  { id: '3', name: 'IBK 간편한통장', balance: 102818 },
  { id: '4', name: '쓸모없는 통장', balance: 58 },
];

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #121212;
  padding: 24px;
`;

const TopBar = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const LogoutButton = styled.TouchableOpacity`
  width: 80px;
  height: 36px;
  background-color: #333;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

const LogoutText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const AccountCard = styled.View`
  background-color: #1e1e1e;
  border-radius: 16px;
  padding: 20px;
  margin-top: 16px;
`;

const AccountName = styled.Text`
  color: #ffffff;
  font-size: 18px;
  margin-bottom: 4px;
`;

const Balance = styled.Text`
  color: #00ffcc;
  font-size: 20px;
  font-weight: bold;
`;

const SendButton = styled.TouchableOpacity`
  margin-top: 12px;
  padding: 12px;
  background-color: #007aff;
  border-radius: 10px;
  align-items: center;
`;

const SendText = styled.Text`
  color: #fff;
  font-weight: bold;
`;

export default function HomeScreen({ navigation, setIsLoggedIn }: Props) {
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Container>
      <TopBar>
        <LogoutButton onPress={handleLogout}>
          <LogoutText>로그아웃</LogoutText>
        </LogoutButton>
      </TopBar>

      {mockAccounts.map((account) => (
        <AccountCard key={account.id}>
          <AccountName>{account.name}</AccountName>
          <Balance>{account.balance.toLocaleString()}원</Balance>
          <SendButton onPress={() => navigation.navigate('AccountDetail', { accountId: account.id })}>
            <SendText>송금</SendText>
          </SendButton>
        </AccountCard>
      ))}
    </Container>
  );
}
