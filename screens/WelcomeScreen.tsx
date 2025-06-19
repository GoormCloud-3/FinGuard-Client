import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';

type WelcomeNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #121212;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 40px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 16px 24px;
  border-radius: 12px;
  margin-top: 12px;
  width: 70%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNavigationProp>();

  return (
    <Container>
      <Title>FinGuard에 오신 것을 환영합니다</Title>
      <Button onPress={() => navigation.navigate('Login')}>
        <ButtonText>로그인</ButtonText>
      </Button>
      <Button onPress={() => navigation.navigate('Signup')}>
        <ButtonText>회원가입</ButtonText>
      </Button>
    </Container>
  );
}
