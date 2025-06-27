import React from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { accountData } from '../src/userAccountData';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  setIsLoggedIn: (value: boolean) => void;
};

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

const AddAccountButton = styled.TouchableOpacity`
  margin-top: 24px;
  padding: 14px;
  background-color: #00c471;
  border-radius: 10px;
  align-items: center;
`;

const AddAccountText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export default function HomeScreen({ navigation, setIsLoggedIn }: Props) {
  const handleLogout = () => setIsLoggedIn(false);

  const accounts = Object.entries(accountData).map(([id, data]) => ({
    id,
    name: data.name,
    balance: data.balance,
  }));

  return (
    <Container>
      <TopBar>
        <LogoutButton onPress={handleLogout}>
          <LogoutText>로그아웃</LogoutText>
        </LogoutButton>
      </TopBar>

      {accounts.map((account) => (
        <AccountCard key={account.id}>
          <AccountName>{account.name}</AccountName>
          <Balance>{account.balance.toLocaleString()}원</Balance>
          <SendButton onPress={() => navigation.navigate('AccountDetail', { accountId: account.id })}>
            <SendText>송금</SendText>
          </SendButton>
        </AccountCard>
      ))}

      {/* ✅ 통장 생성 버튼 */}
      <AddAccountButton onPress={() => navigation.navigate('CreateAccount')}>
        <AddAccountText>＋ 새 통장 만들기</AddAccountText>
      </AddAccountButton>
    </Container>
  );
}
