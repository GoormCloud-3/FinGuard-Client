import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import { RootStackParamList } from '../types';

type Account = {
  accountId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  balance: number;
};
type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [accs, setAccs] = useState<Account[]>([]);
  const ENDPOINT = 'https://esuc0zdtv4.execute-api.ap-northeast-2.amazonaws.com/financial/accounts';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const sub = await AsyncStorage.getItem('USER_SUB');
        if (!sub) throw new Error('사용자 식별자 없음');

        const res = await fetch(`${ENDPOINT}/${sub}`);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

        const { accounts } = (await res.json()) as { accounts: Account[] };
        setAccs(accounts);
      } catch (e: any) {
        console.error(e);
        Alert.alert('계좌 조회 실패', e?.message ?? '알 수 없는 오류');
      }
    };
    fetchAccounts();
  }, []);

  return (
    <Container>
      <Title>내 계좌</Title>

      {accs.map(a => (
        <Card key={a.accountId} onPress={() => navigation.navigate('AccountDetail', { accountId: a.accountId })}>
          <BankTxt>{`${a.bankName} • ${a.accountName}`}</BankTxt>
          <BalTxt>{a.balance.toLocaleString()}원</BalTxt>
        </Card>
      ))}

      <NewBtn onPress={() => navigation.navigate('CreateAccount')}>
        <NewTxt>➕ 새 통장 만들기</NewTxt>
      </NewBtn>
    </Container>
  );
}

/* ───── 스타일 ───── */
const Container = styled.ScrollView`
  flex: 1;
  background: #121212;
  padding: 24px;
`;
const Title = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const Card = styled.TouchableOpacity`
  background: #1e1e1e;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
`;
const BankTxt = styled.Text`color: #aaa; font-size: 14px;`;
const BalTxt = styled.Text`color: #fff; font-size: 20px; font-weight: bold;`;
const NewBtn = styled.TouchableOpacity`
  background: #007aff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 20px;
`;
const NewTxt = styled.Text`color: #fff; font-size: 16px; font-weight: bold;`;
