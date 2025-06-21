import React, { useState } from 'react';
import { Alert, ScrollView, TextInput, Button, View } from 'react-native';
import { signUp } from '../src/cognito'; // 위에서 만든 함수 import
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';


type SignupNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

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
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <TextInput placeholder="아이디" value={id} onChangeText={setId} style={styles.input} />
      <TextInput placeholder="비밀번호" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
      <TextInput placeholder="이름" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="이메일" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="생년월일 (YYYY-MM-DD)" value={birthdate} onChangeText={setBirthdate} style={styles.input} />
      <TextInput placeholder="주소" value={address} onChangeText={setAddress} style={styles.input} />
      <View style={{ marginTop: 20 }}>
        <Button title="회원가입" onPress={handleSignup} />
      </View>
    </ScrollView>
  );
}

const styles = {
  input: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 20,
  },
};
