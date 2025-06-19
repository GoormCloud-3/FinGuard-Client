import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
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
  margin-bottom: 16px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 12px;
`;

const BackText = styled.Text`
  color: #ffffff;
  font-size: 36px;
`;

const Input = styled.TextInput`
  background-color: #1e1e1e;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
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

  const handleSignup = () => {
    // TODO: Cognito 회원가입 처리

    // 회원가입 성공 시 비밀번호 설정 화면으로 이동
    navigation.navigate('SetAccountPin');
  };

  return (
    <Container>
      <Header>
        <BackButton
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate('Welcome');
          }}
        >
          <BackText>←</BackText>
        </BackButton>
      </Header>

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
