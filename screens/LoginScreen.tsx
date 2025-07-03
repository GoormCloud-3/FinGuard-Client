// screens/LoginScreen.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthStackParamList } from '../types';
import { signIn } from '../src/cognito';
import messaging from '@react-native-firebase/messaging';
import { sendFcmTokenToLambda } from '../src/api/sendFcmToken';

type Props = { setIsLoggedIn: (v: boolean) => void };
type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen({ setIsLoggedIn }: Props) {
  const navigation = useNavigation<LoginNavProp>();

  /* ── 입력 State ── */
  const [id, setId]         = useState('');
  const [pw, setPw]         = useState('');

  /* ───────────── FCM 수신 (포그라운드/백그라운드) ───────────── */
  useEffect(() => {
    const unsub = messaging().onMessage(async msg => {
      Alert.alert(msg.notification?.title ?? '📩 새 알림',
                  msg.notification?.body  ?? '알림 내용을 확인하세요.');
    });

    messaging().setBackgroundMessageHandler(async msg => {
      console.log('📦 Background FCM:', msg);
    });

    return unsub;
  }, []);

  /* ───────────── 권한 & 토큰 처리 ───────────── */
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

  const setupFCM = async (userSub: string): Promise<boolean> => {
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
      await sendFcmTokenToLambda(token, userSub);      // <- Lambda 전송
      Alert.alert('푸시 알림 등록 완료', '알림 수신이 정상적으로 설정되었습니다.');
      return true;
    } catch (e: any) {
      console.error('❌ FCM 설정 실패:', e);
      Alert.alert('FCM 설정 실패', e?.message ?? '오류가 발생했습니다.');
      return false;
    }
  };

  /* ───────────── 로그인 ───────────── */
  const handleLogin = async () => {
    try {
      const userSub = await signIn(id, pw);              // sub 반환
      await AsyncStorage.setItem('@userSub', userSub);   // 저장
      Alert.alert('로그인 성공', '푸시 알림 설정을 시작합니다.');

      if (await requestNotifPermission()) {
        if (!(await setupFCM(userSub))) return;
      }
      setIsLoggedIn(true);
    } catch (e: any) {
      Alert.alert('로그인 실패',
                  e?.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  /* ───────────── UI ───────────── */
  return (
    <Container>
      <Header>
        <BackBtn
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Welcome')
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

/* ───────── 스타일 ───────── */
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
