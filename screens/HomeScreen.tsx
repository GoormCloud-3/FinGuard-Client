import React from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AccountCard from '../components/AccountCard';
import SendMoneyButton from '../components/SendMoneyButton';

// props 더 안정적으로 타입화
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
  align-items: center;
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

const CardWrapper = styled.View`
  background-color: #1e1e1e;
  border-radius: 16px;
  padding: 20px;
  margin-top: 16px;
`;

const SubInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  border-top-width: 1px;
  border-top-color: #333;
  padding-top: 12px;
`;

export default function HomeScreen({ navigation, setIsLoggedIn }: Props) {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Container>
      <TopBar>
        <LogoutButton hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={handleLogout}>
          <LogoutText>로그아웃</LogoutText>
        </LogoutButton>
      </TopBar>

      <CardWrapper>
        <AccountCard accountName="FinGuard 통장" balance={1234567} />
        <SubInfoRow />
        <SendMoneyButton onPress={() => navigation.navigate('AccountDetail')} />
      </CardWrapper>
    </Container>
  );
}
