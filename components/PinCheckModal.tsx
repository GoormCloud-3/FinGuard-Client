// PinCheckModal.tsx
import React, { useState, useEffect } from 'react';
import { Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import {
  CognitoUser,
  CognitoUserSession,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { getCurrentUser } from '../src/cognito';

type Props = {
  visible: boolean;
  onClose: () => void;     // 모달 닫기
  onSuccess: () => void;   // PIN 검증 성공 시(송금 화면으로 진입)
};

/* ──────────  콜백 → Promise 래퍼  ────────── */
const getSessionAsync = (user: CognitoUser) =>
  new Promise<CognitoUserSession>((resolve, reject) => {
    user.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        return err || !session ? reject(err) : resolve(session);
      },
    );
  });

const getAttrsAsync = (user: CognitoUser) =>
  new Promise<CognitoUserAttribute[]>((resolve, reject) => {
    user.getUserAttributes((err, attrs) =>
      err || !attrs ? reject(err) : resolve(attrs),
    );
  });

export default function PinCheckModal({ visible, onClose, onSuccess }: Props) {
  const [pin, setPin] = useState('');

  /* 모달이 닫히면 입력값 초기화 */
  useEffect(() => {
    if (!visible) setPin('');
  }, [visible]);

  const handleConfirm = async () => {
    try {
      /* 1️⃣ 로그인 사용자 확인 */
      const user = getCurrentUser();
      if (!user) {
        Alert.alert('로그인 필요', '로그인 정보가 없습니다.');
        return;
      }

      /* 2️⃣ 세션 복원 & 유효성 검사 */
      const session = await getSessionAsync(user);
      if (!session.isValid()) {
        Alert.alert('세션 만료', '다시 로그인 해주세요.');
        return;
      }

      /* 3️⃣ 사용자 속성 조회 */
      const attrs = await getAttrsAsync(user);
      const savedPin = attrs.find(
        a => a.getName() === 'custom:secondaryPin',
      )?.getValue();

      /* 4️⃣ 비교 */
      if (savedPin === pin) {
        setPin('');
        onSuccess(); // AccountDetailScreen 에서 넘겨준 콜백 → SendMoneyScreen 진입
        onClose();   // 모달 닫기
      } else {
        Alert.alert('비밀번호 오류', '2차 비밀번호가 일치하지 않습니다.');
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('오류', e?.message ?? '검증 중 문제가 발생했습니다.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <ModalBackground onPress={onClose}>
        <ModalBox onStartShouldSetResponder={() => true}>
          <Label>2차 비밀번호를 입력하세요</Label>
          <Input
            placeholder="숫자 4자리"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            value={pin}
            onChangeText={setPin}
          />
          <Button onPress={handleConfirm}>
            <ButtonText>확인</ButtonText>
          </Button>
        </ModalBox>
      </ModalBackground>
    </Modal>
  );
}

/* ──────────  스타일  ────────── */
const ModalBackground = styled.TouchableOpacity`
  flex: 1;
  background: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;
const ModalBox = styled.View`
  background: #1e1e1e;
  padding: 24px;
  border-radius: 16px;
  width: 80%;
`;
const Label = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-bottom: 12px;
`;
const Input = styled.TextInput`
  background: #2e2e2e;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;
const Button = styled.TouchableOpacity`
  background: #007aff;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;
const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
