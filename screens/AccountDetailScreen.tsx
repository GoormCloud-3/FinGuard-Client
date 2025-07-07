import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';

/* ── 타입 ─────────────────────────────────────────────── */
type Nav = NativeStackNavigationProp<RootStackParamList, 'AccountDetail'>;
type Rt  = RouteProp<RootStackParamList, 'AccountDetail'>;

type Transaction = {
  transactionId: string;
  title        : string;
  time         : string;
  amount       : number;
  isAnomaly?   : boolean;
};

type AccountRes = {
  accountId    : string;
  accountName  : string;
  accountNumber: string;
  bankName     : string;
  balance      : number;
  transactions : Transaction[];
};

/* ── 컴포넌트 ─────────────────────────────────────────── */
export default function AccountDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params: { accountId } } = useRoute<Rt>();

  const [data   , setData   ] = useState<AccountRes | null>(null);
  const [loading, setLoading] = useState(true);

  const ENDPOINT =
    'https://8v0xmmt294.execute-api.ap-northeast-2.amazonaws.com/accounts';

  /* 계좌 + 거래 조회 */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${ENDPOINT}/${accountId}`);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        setData(await res.json());
      } catch (e: any) {
        console.error(e);
        Alert.alert('계좌 조회 실패', e?.message ?? '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    })();
  }, [accountId]);

  /* 보내기 → EnterAmount (PIN 확인 생략) */
  const handleSend = () => {
  if (!data) {
    Alert.alert('계좌 정보를 불러오지 못했습니다.');
    return;
  }

  navigation.navigate('EnterAmount', {
    fromAccountId: data.accountId,
    myAccount: {
      accountNumber: data.accountNumber,
      accountName  : data.accountName,
      bankName     : data.bankName,
      balance      : data.balance,
    },
  });
};
  /* 로딩 / 오류 화면 */
  if (loading)
    return (
      <Center>
        <ActivityIndicator color="#00c471" />
      </Center>
    );

  if (!data)
    return (
      <Center>
        <Label>계좌 정보를 불러오지 못했습니다.</Label>
      </Center>
    );

  const normal  = data.transactions.filter(t => !t.isAnomaly);
  const anomaly = data.transactions.filter(t =>  t.isAnomaly);

  return (
    <Container>
      {/* ← 뒤로가기 */}
      <Header>
        <BackBtn onPress={() => navigation.goBack()}>
          <BackTxt>←</BackTxt>
        </BackBtn>
      </Header>

      {/* 계좌 요약 */}
      <InfoBox>
        <BankTxt>{`${data.bankName}  ${data.accountName}`}</BankTxt>
        <NumTxt>{data.accountNumber}</NumTxt>
        <BalTxt>{data.balance.toLocaleString()}원</BalTxt>
      </InfoBox>

      {/* 정상 거래 */}
      <Section>📋 정상 거래</Section>
      {normal.map(t => (
        <Txn key={t.transactionId}>
          <Label>{t.title}</Label>
          <Row>
            <Label>{t.time}</Label>
            <Amt pos={t.amount >= 0}>
              {t.amount >= 0 ? '+' : ''}
              {t.amount.toLocaleString()}원
            </Amt>
          </Row>
        </Txn>
      ))}

      {/* 이상 거래 */}
      <Section>🚨 이상 거래</Section>
      {anomaly.length ? (
        anomaly.map(t => (
          <Txn key={t.transactionId}>
            <Label>{t.title}</Label>
            <Row>
              <Label>{t.time}</Label>
              <Amt pos={t.amount >= 0}>
                {t.amount >= 0 ? '+' : ''}
                {t.amount.toLocaleString()}원
              </Amt>
            </Row>
          </Txn>
        ))
      ) : (
        <Label style={{ color: '#666', marginBottom: 16 }}>이상 거래 없음</Label>
      )}

      {/* 하단 버튼 */}
      <Row style={{ marginTop: 40 }}>
        <ActBtn><ActTxt>채우기</ActTxt></ActBtn>
        <ActBtn onPress={handleSend}><ActTxt>보내기</ActTxt></ActBtn>
      </Row>
    </Container>
  );
}

/* ── 스타일 ──────────────────────────────────────────── */
const Container = styled.ScrollView`
  flex: 1;
  background: #121212;
  padding: 24px;
`;
const Center = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #121212;
`;
const Header = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;
const BackBtn = styled.TouchableOpacity`padding: 12px;`;
const BackTxt = styled.Text`color: #fff; font-size: 36px;`;

const InfoBox = styled.View`margin-bottom: 24px;`;
const BankTxt = styled.Text`color: #aaa; font-size: 14px;`;
const NumTxt  = styled.Text`color: #666; font-size: 14px; margin-top: 2px;`;
const BalTxt  = styled.Text`color: #fff; font-size: 32px; font-weight: bold; margin-top: 4px;`;

const Section = styled.Text`
  color: #00c471;
  font-size: 16px;
  font-weight: bold;
  margin: 24px 0 8px;
`;
const Txn = styled.View`
  padding: 16px 0;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;
const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Label = styled.Text`color: #ddd; font-size: 15px;`;
const Amt = styled.Text<{ pos: boolean }>`
  color: ${({ pos }) => (pos ? '#4da6ff' : '#f44336')};
  font-size: 15px;
`;

const ActBtn = styled.TouchableOpacity`
  flex: 1;
  background: #1f4fff;
  margin: 0 4px;
  padding: 14px 0;
  border-radius: 12px;
  align-items: center;
`;
const ActTxt = styled.Text`color: #fff; font-weight: bold; font-size: 16px;`;
