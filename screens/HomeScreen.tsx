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

// 사용자가 가장 먼저 보게 될 화면
// 통장 정보와 송금 버튼을 보여줌
// 버튼을 누르면 AccountDetailScreen으로 이동

export default function HomeScreen() {
    // 화면 전체를 위한 객체
    // navigate('AccountDetail') 같은 메서드를 사용하려면 타입을 정확히 지정해야 오류가 나지 않는다.
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <Container>
      <CardWrapper>
        {/*  통장 이름과 잔액을 보여주는 컴포넌트. props로 값 전달 */}
        {/* 추후에 실제 데이터 받아서 수정 필요 */}
        <AccountCard accountName="FinGuard 통장" balance={1234567} />
        <SubInfoRow>
        </SubInfoRow>
        {/* 버튼을 누르면 AccountDetailScreen으로 이동 */}
        <SendMoneyButton onPress={() => navigation.navigate('AccountDetail')} />
      </CardWrapper>
    </Container>
  );
}
