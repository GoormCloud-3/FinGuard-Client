import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

import AccountCard from '../components/AccountCard';
import SendMoneyButton from '../components/SendMoneyButton';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #121212;
  padding: 24px;
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

const SubInfoText = styled.Text`
  color: #aaa;
  font-size: 13px;
`;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <Container>
      <CardWrapper>
        <AccountCard accountName="FinGuard 통장" balance={1234567} />
        <SubInfoRow>
        </SubInfoRow>
        <SendMoneyButton onPress={() => navigation.navigate('AccountDetail')} />
      </CardWrapper>
    </Container>
  );
}
