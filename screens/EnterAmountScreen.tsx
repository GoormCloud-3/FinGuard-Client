import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';

import { RootStackParamList } from '../types';
import { accountData as bankAccounts } from '../src/accountData';
import { accountData as userAccounts } from '../src/userAccountData';
import { getCurrentUserLocation } from '../src/getUserLocation';
import { useCurrentLocation } from '../src/useCurrentLocation';
import { getDistanceFromLatLonInKm } from '../src/location';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EnterAmount'>;
type RouteProps = RouteProp<RootStackParamList, 'EnterAmount'>;

export default function EnterAmountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { fromAccountId, toAccountId } = route.params;

  const fromAccount = userAccounts[fromAccountId as keyof typeof userAccounts];
  const toAccount = bankAccounts[toAccountId as keyof typeof bankAccounts];

  const [amount, setAmount] = useState('');
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  const location = useCurrentLocation();

  // 사용자 등록된 위도/경도 불러오기
  useEffect(() => {
    const fetch = async () => {
      const userLocation = await getCurrentUserLocation();
      if (userLocation) {
        setUserLat(userLocation.latitude);
        setUserLon(userLocation.longitude);
      }
    };
    fetch();
  }, []);

  // 키패드 입력 처리
  const handleKeyPress = (key: string) => {
    if (key === '←') {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      const next = amount + key;
      const nextAmount = Number(next);

      if (nextAmount > fromAccount.balance) {
        Alert.alert('잔액 부족', '잔액이 부족합니다.');
        setAmount('');
        return;
      }

      if (userLat !== null && userLon !== null && location) {
        const distance = getDistanceFromLatLonInKm(userLat, userLon, location.latitude, location.longitude);
        if (distance > 3) {
          Alert.alert('이상 거래 감지', '현재 위치가 등록된 위치와 너무 멀리 떨어져 있습니다.');
          setAmount('');
          return;
        }
      }

      setAmount(next);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>←</BackText>
        </BackButton>
      </Header>

      {/* 출금 계좌 정보 */}
      <Title>{fromAccount?.name} 계좌에서</Title>
      <BalanceText>잔액 {fromAccount?.balance.toLocaleString()}원</BalanceText>

      {/* 입금 계좌 정보 */}
      <SubTitle>{toAccount?.name} 계좌로</SubTitle>
      <AccountNumber>{toAccount?.number}</AccountNumber>

      {/* 금액 입력 */}
      <Prompt>{amount ? '보낼 금액' : '얼마나 보낼까요?'}</Prompt>
      <AmountBox>₩ {Number(amount || '0').toLocaleString()}</AmountBox>

      {/* 숫자 키패드 */}
      <KeypadContainer>
        {['1','2','3','4','5','6','7','8','9','00','0','←'].map((key) => (
          <KeypadButton key={key} onPress={() => handleKeyPress(key)}>
            <KeypadText>{key}</KeypadText>
          </KeypadButton>
        ))}
      </KeypadContainer>
    </Container>
  );
}

// 스타일 컴포넌트
const Container = styled.ScrollView`
  flex: 1;
  background-color: #121212;
  padding: 24px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 12px;
`;

const BackText = styled.Text`
  color: #ffffff;
  font-size: 36px;
`;

const Title = styled.Text`
  color: #ffffff;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const BalanceText = styled.Text`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 18px;
`;

const SubTitle = styled.Text`
  color: #ffffff;
  font-size: 20px;
  margin-bottom: 4px;
  font-weight: bold;
`;

const AccountNumber = styled.Text`
  color: #ccc;
  font-size: 14px;
  margin-bottom: 24px;
`;

const Prompt = styled.Text`
  color: #999;
  font-size: 18px;
  margin-bottom: 6px;
`;

const AmountBox = styled.Text`
  color: #ffffff;
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 32px;
`;

const KeypadContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const KeypadButton = styled.TouchableOpacity`
  width: 30%;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  background-color: #1e1e1e;
  border-radius: 12px;
`;

const KeypadText = styled.Text`
  color: #ffffff;
  font-size: 26px;
`;
