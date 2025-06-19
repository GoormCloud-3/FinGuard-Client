import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type AccountDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AccountDetail'>;

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

const AccountInfo = styled.View`
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
// 사용자가 송금 버튼을 눌렀을 때 나오는 상세 화면

export default function AccountDetailScreen() {
  // 화면에서 뒤로 돌아가기 기능을 위해 navigation 객체 사용
  const navigation = useNavigation<AccountDetailNavigationProp>();

  return (
    <Container>
      {/* 🔙 상단 뒤로가기 버튼 */}
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

      {/* 잔액 및 계좌번호 */}
      <AccountInfo>
        <BankName>우리은행 1002964460061</BankName>
        <Balance>1,234,567원</Balance>
      </AccountInfo>

      {/* 거래내역 */}
      <Transaction>
        <Label>6.19 우리체크캐시백</Label>
        <TransactionRow>
          <Label>10:56</Label>
          <Amount isPositive={true}>+745원</Amount>
        </TransactionRow>
      </Transaction>

      {/* 하단 버튼 */}
      <TransactionRow style={{ marginTop: 40 }}>
        <ActionButton>
          <ActionText>채우기</ActionText>
        </ActionButton>
        <ActionButton>
          <ActionText>보내기</ActionText>
        </ActionButton>
      </TransactionRow>
    </Container>
  );
}
