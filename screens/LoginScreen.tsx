import React, { useState } from 'react';
import styled from 'styled-components/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../src/cognito';
import { Alert } from 'react-native';

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

type Props = {
  setIsLoggedIn: (value: boolean) => void;
};
const Container = styled.SafeAreaView`
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




export default function LoginScreen({ setIsLoggedIn }: Props) {
  const navigation = useNavigation<LoginNavigationProp>();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(id, password);
      Alert.alert('로그인 성공', '환영합니다!');
      setIsLoggedIn(true); // App.tsx에서 Home으로 전환
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
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

      <Input
        placeholder="아이디"
        placeholderTextColor="#888"
        value={id}
        onChangeText={setId}
      />
      <Input
        placeholder="비밀번호"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button onPress={handleLogin}>
        <ButtonText>로그인</ButtonText>
      </Button>
    </Container>
  );
}
