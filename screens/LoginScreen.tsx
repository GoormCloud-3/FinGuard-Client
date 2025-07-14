import React, { useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthStackParamList } from '../types';
import { signIn } from '../src/cognito';
import messaging from '@react-native-firebase/messaging';

type Props = { setIsLoggedIn: (v: boolean) => void };
type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen({ setIsLoggedIn }: Props) {
  const navigation = useNavigation<LoginNavProp>();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  /* ───── 권한 요청 ───── */
  const requestNotifPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const g = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (g !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('알림 권한 거부됨', '알림을 받을 수 없습니다.');
        return false;
      }
    }
    return true;
  };

  /* ───── FCM 토큰 발급 및 저장 ───── */
  const setupFCM = async (): Promise<boolean> => {
    try {
      const perm = await messaging().requestPermission();
      const enabled =
        perm === messaging.AuthorizationStatus.AUTHORIZED ||
        perm === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        Alert.alert('FCM 권한 거부됨', '푸시 알림을 받을 수 없습니다.');
        return false;
      }

      let token = await messaging().getToken();
      if (!token) {
        await messaging().deleteToken();
        token = await messaging().getToken();
      }
      if (!token) {
        Alert.alert('FCM 토큰 발급 실패', '푸시 알림을 받을 수 없습니다.');
        return false;
      }

      console.log('✅ FCM Token:', token);
      await AsyncStorage.setItem('@fcmToken', token);

      // // ✅ 토큰 alert로 확인
      // Alert.alert('FCM 토큰 발급 성공', token);

      return true;
    } catch (e: any) {
      console.error('❌ FCM 설정 실패:', e);
      Alert.alert('FCM 설정 실패', e?.message ?? '오류가 발생했습니다.');
      return false;
    }
  };

  /* ───── 로그인 ───── */
  const handleLogin = async () => {
    try {
      // 이전 로그인 정보 정리
      await AsyncStorage.multiRemove(['@userSub', '@fcmToken']);

      // Cognito 로그인
      const userSub = await signIn(id, pw);

      // 로컬 저장
      await AsyncStorage.setItem('@userSub', userSub);

      // FCM 권한 + 토큰 발급
      // Alert.alert('로그인 성공', 'FCM 토큰을 확인합니다.');
      if (await requestNotifPermission()) {
        await setupFCM();
      }

      // 로그인 완료 상태 설정
      setIsLoggedIn(true);
    } catch (e: any) {
      Alert.alert(
        '로그인 실패',
        e?.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.',
      );
    }
  };

  /* ───── UI ───── */
  return (
    <Container>
      <Header>
        <BackBtn
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate('Welcome')
          }
        >
          <BackTxt>←</BackTxt>
        </BackBtn>
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
        value={pw}
        onChangeText={setPw}
      />

      <LoginBtn onPress={handleLogin}>
        <LoginTxt>로그인</LoginTxt>
      </LoginBtn>
    </Container>
  );
}

/* ───── 스타일 ───── */
const Container = styled.SafeAreaView`
  flex: 1;
  background: #121212;
  padding: 24px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const BackBtn = styled.TouchableOpacity` padding: 12px; `;
const BackTxt = styled.Text` color: #fff; font-size: 36px; `;

const Input = styled.TextInput`
  background: #1e1e1e;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const LoginBtn = styled.TouchableOpacity`
  background: #007aff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const LoginTxt = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;
