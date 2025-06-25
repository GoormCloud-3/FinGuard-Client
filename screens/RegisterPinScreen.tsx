import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { userPool } from '../src/cognito';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterPin'>;

export default function RegisterPinScreen({ route, navigation }: Props) {
  const [pin, setPin] = useState('');

  const {
    id,
    password,
    name,
    email,
    birthdate,
    address,
    latitude,
    longitude,
  } = route.params;

  const handleKeyPress = (key: string) => {
    if (key === '←') {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 4) {
      setPin((prev) => prev + key);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      Alert.alert('4자리 숫자를 입력해주세요.');
      return;
    }

    const attributeList: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: 'name', Value: name }),
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'birthdate', Value: birthdate }),
      new CognitoUserAttribute({ Name: 'address', Value: address }),
      new CognitoUserAttribute({ Name: 'custom:latitude', Value: latitude }),
      new CognitoUserAttribute({ Name: 'custom:longitude', Value: longitude }),
      new CognitoUserAttribute({ Name: 'custom:secondaryPin', Value: pin }),
    ];

    userPool.signUp(id, password, attributeList, [], (err, _result) => {
      if (err) {
        console.error('회원가입 실패:', err);
        Alert.alert('회원가입 실패', err.message || '문제가 발생했습니다.');
        return;
      }

      Alert.alert('회원가입 완료', '이제 로그인해 주세요.');
      navigation.navigate('Login');
    });
  };

  return (
    <Container>
      <Title>2차 비밀번호 등록</Title>
      <SubTitle>숫자 4자리를 입력해주세요</SubTitle>
      <PinBox>{'*'.repeat(pin.length)}</PinBox>

      <Keypad>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '←', '완료'].map((key) => (
          <Key key={key} onPress={() => (key === '완료' ? handleSubmit() : handleKeyPress(key))}>
            <KeyText>{key}</KeyText>
          </Key>
        ))}
      </Keypad>
    </Container>
  );
}

// ===== styled-components =====

const Container = styled.View`
  flex: 1;
  background-color: #121212;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Title = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  color: #aaa;
  font-size: 16px;
  margin-bottom: 20px;
`;

const PinBox = styled.Text`
  color: #fff;
  font-size: 36px;
  letter-spacing: 10px;
  margin-bottom: 40px;
`;

const Keypad = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 80%;
`;

const Key = styled.TouchableOpacity`
  width: 30%;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
  background-color: #1e1e1e;
  border-radius: 12px;
  margin: 8px;
`;

const KeyText = styled.Text`
  color: #fff;
  font-size: 24px;
`;
