import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Alert, Modal } from 'react-native';
import { getCurrentUser } from '../src/cognito';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function PinCheckModal({ visible, onClose, onSuccess }: Props) {
  const [pin, setPin] = useState('');

  const handleConfirm = async () => {
    try {
      const user = getCurrentUser();

      if (!user) {
        Alert.alert('로그인 필요', '로그인 정보가 없습니다.');
        return;
      }

      // ✅ 세션 복원
      user.getSession((err: Error | null, session: CognitoUserSession | null) => {
  if (err || !session?.isValid()) {
    Alert.alert('세션 만료', '다시 로그인 해주세요.');
    return;
  }

        // ✅ 사용자 속성 가져오기
        user.getUserAttributes((err, attributes) => {
          if (err || !attributes) {
            Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
            return;
          }

          const pinAttr = attributes.find(attr => attr.getName() === 'custom:secondaryPin');

          if (pinAttr?.getValue() === pin) {
            setPin('');
            onSuccess();
            onClose();
          } else {
            Alert.alert('비밀번호 오류', '2차 비밀번호가 일치하지 않습니다.');
          }
        });
      });
    } catch (e) {
      Alert.alert('오류', '검증 중 오류가 발생했습니다.');
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

// ===== styled-components =====
const ModalBackground = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.View`
  background-color: #1e1e1e;
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
  background-color: #2e2e2e;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
