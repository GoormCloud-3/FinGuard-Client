import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import PinCheckModal from '../components/PinCheckModal';

type AccountDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AccountDetail'>;
type AccountDetailRouteProp = RouteProp<RootStackParamList, 'AccountDetail'>;

type AccountInfo = {
  name: string;
  number: string;
  balance: number;
};

type Transaction = {
  id: string;
  title: string;
  time: string;
  amount: number;
  isAnomaly?: boolean;
};

export default function AccountDetailScreen() {
  const navigation = useNavigation<AccountDetailNavigationProp>();
  const route = useRoute<AccountDetailRouteProp>();
  const { accountId } = route.params;

  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pinModalVisible, setPinModalVisible] = useState(false);

  const API_BASE = 'http://10.0.2.2:4000';

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetch(`${API_BASE}/accounts/${accountId}`);
      const data = await res.json();
      setAccount(data);
    };

    const fetchTransactions = async () => {
      const res = await fetch(`${API_BASE}/transactions?accountId=${accountId}`);
      const data = await res.json();
      setTransactions(data);
    };

    fetchAccount();
    fetchTransactions();
  }, [accountId]);

  const handleSend = () => setPinModalVisible(true);

  const handlePinSuccess = () => {
    const toAccountId = '2'; // 예시로 우리은행 계좌로 송금
    navigation.navigate('EnterAmount', {
      fromAccountId: accountId,
      toAccountId,
    });
  };

  if (!account) {
    return (
      <Container>
        <Label>해당 계좌 정보를 찾을 수 없습니다.</Label>
      </Container>
    );
  }

  const normalTx = transactions.filter(tx => !tx.isAnomaly);
  const anomalyTx = transactions.filter(tx => tx.isAnomaly);

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>←</BackText>
        </BackButton>
      </Header>

      <AccountInfoBox>
        <BankName>{account.name} {account.number}</BankName>
        <Balance>{account.balance.toLocaleString()}원</Balance>
      </AccountInfoBox>

      <SectionTitle>📋 정상 거래</SectionTitle>
      {normalTx.map(tx => (
        <Transaction key={tx.id}>
          <Label>{tx.title}</Label>
          <TransactionRow>
            <Label>{tx.time}</Label>
            <Amount isPositive={tx.amount >= 0}>
              {tx.amount >= 0 ? '+' : ''}
              {tx.amount.toLocaleString()}원
            </Amount>
          </TransactionRow>
        </Transaction>
      ))}

      <SectionTitle>🚨 이상 거래</SectionTitle>
      {anomalyTx.length > 0 ? (
        anomalyTx.map(tx => (
          <Transaction key={tx.id}>
            <Label>{tx.title}</Label>
            <TransactionRow>
              <Label>{tx.time}</Label>
              <Amount isPositive={tx.amount >= 0}>
                {tx.amount >= 0 ? '+' : ''}
                {tx.amount.toLocaleString()}원
              </Amount>
            </TransactionRow>
          </Transaction>
        ))
      ) : (
        <Label style={{ color: '#666', marginBottom: 16 }}>이상 거래 없음</Label>
      )}

      <TransactionRow style={{ marginTop: 40 }}>
        <ActionButton>
          <ActionText>채우기</ActionText>
        </ActionButton>
        <ActionButton onPress={handleSend}>
          <ActionText>보내기</ActionText>
        </ActionButton>
      </TransactionRow>

      <PinCheckModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handlePinSuccess}
      />
    </Container>
  );
}

// ===== styled-components =====
const Container = styled.ScrollView`
  flex: 1;
  background-color: #121212;
  padding: 24px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 12px;
`;

const BackText = styled.Text`
  color: #ffffff;
  font-size: 36px;
`;

const AccountInfoBox = styled.View`
  margin-bottom: 24px;
`;

const BankName = styled.Text`
  color: #aaa;
  font-size: 14px;
`;

const Balance = styled.Text`
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  margin-top: 4px;
`;

const SectionTitle = styled.Text`
  color: #00c471;
  font-size: 16px;
  font-weight: bold;
  margin-top: 24px;
  margin-bottom: 8px;
`;

const Transaction = styled.View`
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;

const TransactionRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Label = styled.Text`
  color: #ddd;
  font-size: 15px;
`;

const Amount = styled.Text<{ isPositive?: boolean }>`
  color: ${(props) => (props.isPositive ? '#4da6ff' : '#f44336')};
  font-size: 15px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #1f4fff;
  margin: 0 4px;
  padding: 14px 0;
  border-radius: 12px;
  align-items: center;
`;

const ActionText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
