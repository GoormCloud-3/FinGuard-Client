import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #121212;
  padding: 24px;
  justify-content: center;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 12px;
`;

const BackText = styled.Text`
  color: #ffffff;
  font-size: 36px;
`;

const Title = styled.Text`
  font-size: 20px;
  color: #fff;
  margin-bottom: 12px;
`;

const Input = styled.TextInput`
  background-color: #1e1e1e;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  font-size: 18px;
  letter-spacing: 10px;
  text-align: center;
  margin-bottom: 24px;
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

export default function SetAccountPinScreen() {
  const [pin, setPin] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

  const handleSavePin = () => {
    if (pin.length !== 4 || isNaN(Number(pin))) {
      Alert.alert('4자리 숫자로 입력해주세요.');
      return;
    }

    // TODO: 저장 처리 (예: AsyncStorage, DB 등)
    Alert.alert('통장 비밀번호가 설정되었습니다.');

    // 홈 화면으로 이동
    navigation.navigate('Home');
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackText>←</BackText>
        </BackButton>
      </Header>

      <Title>4자리 통장 비밀번호를 설정하세요</Title>
      <Input
        placeholder="●●●●"
        placeholderTextColor="#888"
        maxLength={4}
        keyboardType="number-pad"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
      />
      <Button onPress={handleSavePin}>
        <ButtonText>설정 완료</ButtonText>
      </Button>
    </Container>
  );
}
