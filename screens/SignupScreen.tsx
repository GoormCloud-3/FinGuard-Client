import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { getCoordinatesFromAddress } from '../src/location';

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
    if (!id || !password || !name || !email || !birthdate || !address) {
      Alert.alert('모든 정보를 입력해주세요.');
      return;
    }

    try {
      const { latitude, longitude } = await getCoordinatesFromAddress(address);

      navigation.navigate('RegisterPin', {
        id,
        password,
        name,
        email,
        birthdate,
        address,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
    } catch (err: any) {
      Alert.alert('주소 오류', err.message || '주소를 확인해주세요.');
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

      <Input placeholder="아이디" value={id} onChangeText={setId} />
      <Input placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
      <Input placeholder="이름" value={name} onChangeText={setName} />
      <Input placeholder="이메일" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input placeholder="생년월일 (YYYY-MM-DD)" value={birthdate} onChangeText={setBirthdate} />
      <Input placeholder="주소" value={address} onChangeText={setAddress} />

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
  background-color: #1e1e1e;
  color: #fff;
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
const ButtonText = styled.Text`color: white; font-size: 18px; font-weight: 600;`;
