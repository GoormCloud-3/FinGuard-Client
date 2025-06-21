import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { signUp } from '../src/cognito';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';

type SignupNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

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
  padding: 8px;
`;

const BackText = styled.Text`
  color: #ffffff;
  font-size: 32px;
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 32px;
`;

const Input = styled.TextInput`
  background-color: #1e1e1e;
  color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 16px;
  border: 1px solid #2e2e2e;
`;

const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  margin-top: 24px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

export default function SignupScreen() {
  const navigation = useNavigation<SignupNavigationProp>();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');

  const handleSignup = async () => {
    try {
      await signUp({ id, password, name, email, birthdate, address });
      Alert.alert('회원가입 완료', '이제 로그인해주세요.');
      navigation.navigate('Welcome');
    } catch (error: any) {
      Alert.alert('회원가입 실패', error.message || '문제가 발생했습니다.');
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Welcome'))}>
          <BackText>←</BackText>
        </BackButton>
      </Header>

      <Title>FinGuard 회원가입</Title>

      <Input placeholder="아이디" placeholderTextColor="#888" value={id} onChangeText={setId} />
      <Input placeholder="비밀번호" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
      <Input placeholder="이름" placeholderTextColor="#888" value={name} onChangeText={setName} />
      <Input placeholder="이메일" placeholderTextColor="#888" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Input placeholder="생년월일 (YYYY-MM-DD)" placeholderTextColor="#888" value={birthdate} onChangeText={setBirthdate} />
      <Input placeholder="주소" placeholderTextColor="#888" value={address} onChangeText={setAddress} />

      <Button onPress={handleSignup}>
        <ButtonText>회원가입</ButtonText>
      </Button>
    </Container>
  );
}
