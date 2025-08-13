// SignupScreen.tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { getCoordinatesFromAddress } from '../src/location';
import { sanitizeEmail, sanitizeAddress, sanitizeName } from '../src/security/sanitize'; 

type SignupNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export default function SignupScreen() {
  const navigation = useNavigation<SignupNavigationProp>();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');

  const handleNext = async () => {
    const safeName = sanitizeName(name, 30);
    const safeMail = sanitizeEmail(email, 254);
    const safeAddr = sanitizeAddress(address, 120);

    if (!id || !password || !safeName || !safeMail || !birthdate || !safeAddr) {
      Alert.alert('모든 정보를 입력해주세요.');
      return;
    }
    // ✅ 생년월일 형식 검증 (간단)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
      Alert.alert('형식 오류', '생년월일은 YYYY-MM-DD 형식으로 입력하세요.');
      return;
    }

    try {
      const { latitude, longitude } = await getCoordinatesFromAddress(safeAddr);
      navigation.navigate('RegisterPin', {
        id,
        password,
        name: safeName,
        email: safeMail,
        birthdate,
        address: safeAddr,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
    } catch (err: any) {
      Alert.alert('주소 오류', err?.message || '주소를 확인해주세요.');
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>←</BackText>
        </BackButton>
      </Header>

      <Title>FinGuard 회원가입</Title>

      <Input placeholder="아이디" value={id} onChangeText={setId} autoCapitalize="none" />
      <Input placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
      <Input placeholder="이름" value={name} onChangeText={(t) => setName(sanitizeName(t, 30))} />
      <Input placeholder="이메일" value={email} onChangeText={(t) => setEmail(sanitizeEmail(t, 254))} keyboardType="email-address" autoCapitalize="none" />
      <Input placeholder="생년월일 (YYYY-MM-DD)" value={birthdate} onChangeText={setBirthdate} keyboardType="numbers-and-punctuation" />
      <Input placeholder="주소" value={address} onChangeText={(t) => setAddress(sanitizeAddress(t, 120))} />

      <Button onPress={handleNext}>
        <ButtonText>다음</ButtonText>
      </Button>
    </Container>
  );
}

const Container = styled.ScrollView`flex: 1; background-color: #121212; padding: 24px;`;
const Header = styled.View`flex-direction: row; align-items: center; margin-bottom: 24px;`;
const BackButton = styled.TouchableOpacity`padding: 8px;`;
const BackText = styled.Text`color: #fff; font-size: 32px;`;
const Title = styled.Text`font-size: 26px; font-weight: bold; color: #fff; margin-bottom: 32px;`;
const Input = styled.TextInput`
  background-color: #1e1e1e; color: #fff; padding: 16px; border-radius: 12px; font-size: 16px;
  margin-bottom: 16px; border: 1px solid #2e2e2e;
`;
const Button = styled.TouchableOpacity`background-color: #007aff; padding: 18px; border-radius: 12px; align-items: center; margin-top: 24px;`;
const ButtonText = styled.Text`color: white; font-size: 18px; font-weight: 600;`;
