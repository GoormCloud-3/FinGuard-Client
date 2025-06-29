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

const accountData: Record<string, AccountInfo> = {
  '1': { name: 'Finguard 통장', number: '1000123456789', balance: 1234567 },
  '2': { name: '우리은행', number: '1028374650912', balance: 180000 },
  '3': { name: 'IBK 통장', number: '1234567890123', balance: 102345},
  '4': { name: '입출금통장', number: '9876543210987', balance: 50 },
};

export default function AccountDetailScreen() {
  const navigation = useNavigation<AccountDetailNavigationProp>();
  const route = useRoute<AccountDetailRouteProp>();
  const { accountId } = route.params;

  const [pinModalVisible, setPinModalVisible] = useState(false);

  const account = accountData[accountId];

  const handleSend = () => {
    setPinModalVisible(true);
  };

  const handlePinSuccess = () => {
    navigation.navigate('SendMoney', { fromAccountId: accountId });
  };

  if (!account) {
    return (
      <Container>
        <Label>해당 계좌 정보를 찾을 수 없습니다.</Label>
      </Container>
    );
  }

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

      <Transaction>
        <Label>6.19 Finguard캐시백</Label>
        <TransactionRow>
          <Label>10:56</Label>
          <Amount isPositive={true}>+745원</Amount>
        </TransactionRow>
      </Transaction>

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

// styled-components
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
