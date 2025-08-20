import React, { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { getCoordinatesFromAddress } from '../src/location';
import {
  sanitizeEmail,
  sanitizeAddress,
  sanitizeName,
} from '../src/security/sanitize';

type SignupNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// YYYY-MM-DD 형식 + 실제 날짜 유효성 검사
function isValidBirthdate(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [yy, mm, dd] = dateStr.split('-').map(Number);
  if (yy < 1900 || yy > 2100) return false;
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  const d = new Date(yy, mm - 1, dd);
  // JS Date 보정이 없었는지 확인
  return d.getFullYear() === yy && d.getMonth() === mm - 1 && d.getDate() === dd;
}

export default function SignupScreen() {
  const navigation = useNavigation<SignupNavigationProp>();

  // 원본 입력값 (onBlur에서 정제/검증)
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');

  // 에러 메시지 상태 (하단 붉은 텍스트로 표시)
  const [nameErr, setNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [birthErr, setBirthErr] = useState('');
  const [addrErr, setAddrErr] = useState('');

 
  const onBlurName = () => {
    const safe = sanitizeName(name, 30);
    if (!safe.trim()) {
      setNameErr('이름은 한글/영문과 공백만 입력 가능합니다.');
      Alert.alert('입력 오류', '이름은 한글/영문과 공백만 입력 가능합니다.');
      return;
    }
    if (safe !== name) {
      setName(safe);
      setNameErr('허용되지 않는 문자를 제거했습니다.');
      Alert.alert('입력 정리됨', '이름에서 허용되지 않는 문자를 제거했습니다.');
    } else {
      setNameErr('');
    }
  };

  const onBlurEmail = () => {
    const safe = sanitizeEmail(email, 254);
    let err = '';
    if (safe !== email) {
      setEmail(safe);
      err = '허용되지 않는 문자를 제거했습니다.';
      Alert.alert('입력 정리됨', '이메일에서 허용되지 않는 문자를 제거했습니다.');
    }
    if (!EMAIL_REGEX.test(safe)) {
      err = '이메일 형식이 올바르지 않습니다. 예) user@example.com';
      Alert.alert('형식 오류', '이메일 형식이 올바르지 않습니다.');
    }
    setEmailErr(err);
  };

  const onBlurBirth = () => {
    if (!birthdate) {
      setBirthErr('생년월일을 입력하세요. (YYYY-MM-DD)');
      return;
    }
    if (!isValidBirthdate(birthdate)) {
      setBirthErr('생년월일 형식이 올바르지 않습니다. (YYYY-MM-DD)');
      Alert.alert('형식 오류', '생년월일은 YYYY-MM-DD 형식이며 실제 날짜여야 합니다.');
    } else {
      setBirthErr('');
    }
  };

  const onBlurAddress = () => {
    const safe = sanitizeAddress(address, 120);
    if (!safe.trim()) {
      setAddrErr('주소를 입력하세요. (한글/영문/숫자/공백/-,.() 허용)');
      Alert.alert('입력 오류', '주소를 입력하세요.');
      return;
    }
    if (safe !== address) {
      setAddress(safe);
      setAddrErr('허용되지 않는 문자를 제거했습니다.');
      Alert.alert('입력 정리됨', '주소에서 허용되지 않는 문자를 제거했습니다.');
    } else {
      setAddrErr('');
    }
  };

  // 버튼 활성화 조건 (간단)
  const canSubmit = useMemo(() => {
    const baseFilled = id && password && name && email && birthdate && address;
    const noErrors = !nameErr && !emailErr && !birthErr && !addrErr;
    return Boolean(baseFilled && noErrors);
  }, [id, password, name, email, birthdate, address, nameErr, emailErr, birthErr, addrErr]);

  // “다음” 클릭 시 최종 점검 + 네비게이션
  const handleNext = async () => {
    // 1) 마지막으로 한 번 더 검사
    onBlurName();
    onBlurEmail();
    onBlurBirth();
    onBlurAddress();

    // 2) 종합 오류 수집
    const issues: string[] = [];
    if (!id) issues.push('아이디를 입력하세요.');
    if (!password) issues.push('비밀번호를 입력하세요.');
    if (nameErr || !name.trim()) issues.push('이름을 확인하세요.');
    if (emailErr || !EMAIL_REGEX.test(email)) issues.push('이메일 형식을 확인하세요.');
    if (birthErr || !isValidBirthdate(birthdate)) issues.push('생년월일 형식을 확인하세요.');
    if (addrErr || !address.trim()) issues.push('주소를 확인하세요.');

    if (issues.length) {
      Alert.alert('입력 확인', issues.join('\n'));
      return;
    }

    // 3) 좌표 조회 후 다음 화면으로
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

      <Input
        placeholder="아이디"
        value={id}
        onChangeText={setId}
        autoCapitalize="none"
      />

      <Input
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Input
        placeholder="이름 (한글/영문/공백)"
        value={name}
        onChangeText={setName}
        onBlur={onBlurName}               
      />
      {nameErr ? <ErrText>{nameErr}</ErrText> : null}

      <Input
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        onBlur={onBlurEmail}              
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailErr ? <ErrText>{emailErr}</ErrText> : null}

      <Input
        placeholder="생년월일 (YYYY-MM-DD)"
        value={birthdate}
        onChangeText={setBirthdate}
        onBlur={onBlurBirth}              
        keyboardType="numbers-and-punctuation"
      />
      {birthErr ? <ErrText>{birthErr}</ErrText> : null}

      <Input
        placeholder="주소 (한글/영문/숫자/공백/-,.())"
        value={address}
        onChangeText={setAddress}
        onBlur={onBlurAddress}            
      />
      {addrErr ? <ErrText>{addrErr}</ErrText> : null}

      <Button onPress={handleNext} disabled={!canSubmit}>
        <ButtonText>{canSubmit ? '다음' : '회원가입'}</ButtonText>
      </Button>
    </Container>
  );
}

/* 스타일 */
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
const BackButton = styled.TouchableOpacity`padding: 8px;`;
const BackText = styled.Text`color: #fff; font-size: 32px;`;
const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 32px;
`;
const Input = styled.TextInput.attrs(() => ({
  placeholderTextColor: 'rgba(255,255,255,0.7)',
}))`
  background-color: #1e1e1e;
  color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;

  border: 1px solid #3a3a3a;


  margin-bottom: 6px;
`;
const ErrText = styled.Text`
  color: #ff7676;
  font-size: 12px;
  margin-bottom: 10px;
`;
const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#3a3a3a' : '#007aff')};
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  margin-top: 16px;
`;
const ButtonText = styled.Text`color: white; font-size: 18px; font-weight: 600;`;