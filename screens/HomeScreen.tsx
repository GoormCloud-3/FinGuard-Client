import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import PinCheckModal from '../components/PinCheckModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  setIsLoggedIn: (value: boolean) => void;
};

type Account = {
  id: string;
  name: string;
  balance: number;
};

export default function HomeScreen({ navigation, setIsLoggedIn }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [pinModalVisible, setPinModalVisible] = useState(false);

  const API_URL = 'http://10.0.2.2:4000/accounts'; // ✅ Android 에뮬레이터 기준

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('계좌 목록 조회 실패');
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error('❌ 계좌 API 오류:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleLogout = () => setIsLoggedIn(false);

  const handlePressSend = (accountId: string) => {
    setSelectedAccountId(accountId);
    setPinModalVisible(true);
  };

  const handlePinSuccess = () => {
    if (selectedAccountId) {
      navigation.navigate('AccountDetail', { accountId: selectedAccountId });
    }
  };

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
          <SendButton onPress={() => handlePressSend(account.id)}>
            <SendText>송금</SendText>
          </SendButton>
        </AccountCard>
      ))}

      <AddAccountButton onPress={() => navigation.navigate('CreateAccount')}>
        <AddAccountText>＋ 새 통장 만들기</AddAccountText>
      </AddAccountButton>

      <PinCheckModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handlePinSuccess}
      />
    </Container>
  );
}

// ===== styled-components =====
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
