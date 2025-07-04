// screens/CreateAccountScreen.tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export default function CreateAccountScreen({ navigation }: Props) {
  /* ── 입력값 ── */
  const [accountName, setAccountName] = useState('');
  const [bankName,   setBankName]   = useState('');

  /* ── 계좌 생성 ── */
  const handleCreate = async () => {
    if (!accountName.trim() || !bankName.trim()) {
      Alert.alert('모든 필드를 입력해주세요.');
      return;
    }

    /* ① 로그인 때 저장해 둔 sub 읽기 */
    const userSub = await AsyncStorage.getItem('@userSub');
    if (!userSub) {
      Alert.alert('세션 오류', '사용자 정보를 찾을 수 없습니다. 다시 로그인해 주세요.');
      return;
    }

    /* ② 전송 Payload */
    const payload = {
      userSub,
      accountName: accountName.trim(),
      bankName:   bankName.trim(),
    };

    try {
      const res = await fetch(
        'https://8v0xmmt294.execute-api.ap-northeast-2.amazonaws.com/financial/accounts',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

      Alert.alert('통장이 생성되었습니다!', '', [
        { text: '확인', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (e: any) {
      console.error(e);
      Alert.alert('통장 생성 실패', e?.message ?? '알 수 없는 오류가 발생했습니다.');
    }
  };

  /* ── UI ── */
  return (
    <Container>
      <Title>새 통장 만들기</Title>

      <Label>은행명</Label>
      <Input
        placeholder="예: 국민은행"
        placeholderTextColor="#888"
        value={bankName}
        onChangeText={setBankName}
      />

      <Label>통장 이름</Label>
      <Input
        placeholder="예: 생활비 통장"
        placeholderTextColor="#888"
        value={accountName}
        onChangeText={setAccountName}
      />

      <CreateBtn onPress={handleCreate}>
        <CreateTxt>통장 생성</CreateTxt>
      </CreateBtn>
    </Container>
  );
}

/* ───────── 스타일 ───────── */
const Container = styled.SafeAreaView`
  flex: 1;
  background: #121212;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  color: #fff;
  margin-bottom: 24px;
`;

const Label = styled.Text`
  color: #ccc;
  font-size: 14px;
  margin-bottom: 4px;
`;

const Input = styled.TextInput`
  background: #1e1e1e;
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const CreateBtn = styled.TouchableOpacity`
  background: #007aff;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
`;

const CreateTxt = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
