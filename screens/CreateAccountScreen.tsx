import React, { useState } from 'react';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Alert, Modal, FlatList } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

const bankConfig: Record<string, { label: string; min: number; max: number }> = {
  kb: { label: '국민은행', min: 10, max: 14 },
  shinhan: { label: '신한은행', min: 10, max: 14 },
  woori: { label: '우리은행', min: 10, max: 14 },
  ibk: { label: 'IBK기업은행', min: 10, max: 14 },
  hana: { label: '하나은행', min: 10, max: 14 },
};

export default function CreateAccountScreen({ navigation }: Props) {
  const [bank, setBank] = useState<string>('kb');
  const [modalVisible, setModalVisible] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const { min, max, label } = bankConfig[bank];

  const handleCreate = async () => {
    if (!name.trim() || !accountNumber.trim() || !initialBalance.trim()) {
      Alert.alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!/^\d+$/.test(accountNumber)) {
      Alert.alert('통장번호는 숫자만 입력할 수 있습니다.');
      return;
    }

    if (accountNumber.length < min || accountNumber.length > max) {
      Alert.alert(`${label} 통장번호는 ${min}~${max}자리여야 합니다.`);
      return;
    }

    if (isNaN(Number(initialBalance))) {
      Alert.alert('초기 금액은 숫자만 입력해주세요.');
      return;
    }

    const newAccount = {
      id: Date.now().toString(), // 고유 ID 생성
      name,
      number: accountNumber,
      balance: Number(initialBalance),
    };

    try {
      const res = await fetch('http://10.0.2.2:4000/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      });

      if (!res.ok) {
        throw new Error('통장 생성 실패');
      }

      Alert.alert('통장이 생성되었습니다!', '', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert('에러', '통장 생성 중 문제가 발생했습니다.');
    }
  };

  return (
    <Container>
      <Title>새 통장 만들기</Title>

      <Label>은행 선택</Label>
      <DropdownButton onPress={() => setModalVisible(true)}>
        <DropdownText>{bankConfig[bank].label} ▼</DropdownText>
      </DropdownButton>

      <Modal transparent animationType="slide" visible={modalVisible}>
        <ModalBackdrop onPress={() => setModalVisible(false)}>
          <ModalContent onStartShouldSetResponder={() => true}>
            <FlatList
              data={Object.entries(bankConfig)}
              keyExtractor={([key]) => key}
              renderItem={({ item: [key, data] }) => (
                <BankOption
                  onPress={() => {
                    setBank(key);
                    setAccountNumber('');
                    setModalVisible(false);
                  }}
                >
                  <BankOptionText>{data.label}</BankOptionText>
                </BankOption>
              )}
            />
          </ModalContent>
        </ModalBackdrop>
      </Modal>

      <Label>통장번호 ({min}~{max}자리)</Label>
      <Input
        placeholder="숫자만 입력"
        placeholderTextColor="#888"
        keyboardType="numeric"
        maxLength={max}
        value={accountNumber}
        onChangeText={setAccountNumber}
      />

      <Label>통장 이름</Label>
      <Input
        placeholder="예: 생활비 통장"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <Label>초기 금액</Label>
      <Input
        placeholder="예: 100000"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={initialBalance}
        onChangeText={setInitialBalance}
      />

      <CreateButton onPress={handleCreate}>
        <CreateText>통장 생성</CreateText>
      </CreateButton>
    </Container>
  );
}

// 스타일 컴포넌트 정의
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #121212;
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

const DropdownButton = styled.TouchableOpacity`
  background-color: #1e1e1e;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const DropdownText = styled.Text`
  color: #fff;
  font-size: 16px;
`;

const Input = styled.TextInput`
  background-color: #1e1e1e;
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
`;

const CreateText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const ModalBackdrop = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: #222;
  padding: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  max-height: 50%;
`;

const BankOption = styled.TouchableOpacity`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #444;
`;

const BankOptionText = styled.Text`
  color: #fff;
  font-size: 16px;
`;
