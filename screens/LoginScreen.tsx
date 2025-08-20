import React, { useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthStackParamList } from '../types';
import { signIn } from '../src/cognito';
import messaging from '@react-native-firebase/messaging';
import { saveFcmToken, deleteFcmToken } from '../src/secureStorage';
import * as Keychain from 'react-native-keychain';
import { sendFcmTokenToApi } from '../src/api/sendFcmToken';

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

  /* ───── FCM 토큰 발급 및 저장 (로그인 시마다 갱신) ───── */
  const setupFCM = async (): Promise<string | null> => {
    try {
      // 권한 요청
      const perm = await messaging().requestPermission();
      const enabled =
        perm === messaging.AuthorizationStatus.AUTHORIZED ||
        perm === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        Alert.alert('FCM 권한 거부됨', '푸시 알림을 받을 수 없습니다.');
        return null;
      }

      // 🔄 기존 토큰 삭제
      await deleteFcmToken();
      await messaging().deleteToken();

      // ✅ 새 토큰 발급
      const token = await messaging().getToken();
      if (!token) {
        Alert.alert('FCM 토큰 발급 실패', '푸시 알림을 받을 수 없습니다.');
        return null;
      }

      console.log('✅ 새 FCM Token:', token);

      // 🔐 SecureStorage 저장
      await saveFcmToken(token);

      return token;
    } catch (e: any) {
      console.error('❌ FCM 설정 실패:', e);
      Alert.alert('FCM 설정 실패', e?.message ?? '오류가 발생했습니다.');
      return null;
    }
  };

  /* ───── 로그인 (기존 handleLogin 주석처리) ───── */
  // const handleLogin = async () => {
  //   try {
  //     await AsyncStorage.multiRemove(['@userSub', '@fcmToken']);
  //     const { sub, idToken } = await signIn(id, pw);
  //     await AsyncStorage.setItem('@userSub', sub);
  //     await Keychain.setGenericPassword('jwt', idToken, { service: 'id_token' });
  //     if (await requestNotifPermission()) {
  //       await setupFCM();
  //     }
  //     setIsLoggedIn(true);
  //   } catch (e: any) {
  //     Alert.alert('로그인 실패', e?.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.');
  //   }
  // };

  const handleLogin = async () => {
    try {
      // 1. 이전 로그인 정보 제거
      await AsyncStorage.multiRemove(['@userSub', '@fcmToken']);

      // 2. Cognito 로그인
      const { sub, idToken } = await signIn(id, pw);

      // 3. 사용자 정보 저장
      await AsyncStorage.setItem('@userSub', sub);
      await Keychain.setGenericPassword('jwt', idToken, { service: 'id_token' });

      // 4. 알림 권한 확인
      const granted = await requestNotifPermission();
      if (!granted) return;

      // 5. FCM 토큰 갱신 및 저장
      const newToken = await setupFCM();
      if (!newToken) return;

      // 6. Lambda에 FCM 토큰 전송
      try {
        await sendFcmTokenToApi(newToken, sub);
        console.log('✅ FCM 토큰을 Lambda에 성공적으로 전송했습니다.');
      } catch (err) {
        console.error('❌ Lambda 전송 실패:', err);
      }

      // 7. 로그인 상태 변경
      setIsLoggedIn(true);
    } catch (e: any) {
      Alert.alert('로그인 실패', e?.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.');
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