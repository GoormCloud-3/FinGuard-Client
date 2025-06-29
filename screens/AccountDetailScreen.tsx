import React, { useState } from 'react';
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

const accountData: Record<string, AccountInfo> = {
  '1': { name: 'Finguard 통장', number: '1000123456789', balance: 1234567 },
  '2': { name: '우리은행', number: '1028374650912', balance: 180000 },
  '3': { name: 'IBK 통장', number: '1234567890123', balance: 102345 },
  '4': { name: '입출금통장', number: '9876543210987', balance: 50 },
};

// ✨ 예시 거래 내역 (정상/이상 구분)
const transactions: Transaction[] = [
  { id: 't1', title: 'Finguard 캐시백', time: '10:56', amount: 745 },
  { id: 't2', title: '서울 송금', time: '12:30', amount: -100000, isAnomaly: true },
  { id: 't3', title: '편의점 결제', time: '15:40', amount: -4200 },
];

export default function AccountDetailScreen() {
  const navigation = useNavigation<AccountDetailNavigationProp>();
  const route = useRoute<AccountDetailRouteProp>();
  const { accountId } = route.params;

  const [pinModalVisible, setPinModalVisible] = useState(false);
  const account = accountData[accountId];

  const handleSend = () => setPinModalVisible(true);
  const handlePinSuccess = () => navigation.navigate('SendMoney', { fromAccountId: accountId });

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
        <BackButton
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }}
        >
          <BackText>←</BackText>
        </BackButton>
      </Header>

      <AccountInfoBox>
        <BankName>{account.name} {account.number}</BankName>
        <Balance>{account.balance.toLocaleString()}원</Balance>
      </AccountInfoBox>

      {/* ✅ 정상 거래 목록 */}
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

      {/* ✅ 이상 거래 목록 */}
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

      {/* 하단 버튼 */}
      <TransactionRow style={{ marginTop: 40 }}>
        <ActionButton>
          <ActionText>채우기</ActionText>
        </ActionButton>
        <ActionButton onPress={handleSend}>
          <ActionText>보내기</ActionText>
        </ActionButton>
      </TransactionRow>

      {/* 2차 비밀번호 모달 */}
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
