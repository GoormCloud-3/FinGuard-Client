import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../types';
import { signIn } from '../src/cognito';
import messaging from '@react-native-firebase/messaging';
import { sendFcmTokenToLambda } from '../src/api/sendFcmToken';

type Props = {
  setIsLoggedIn: (value: boolean) => void;
};

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen({ setIsLoggedIn }: Props) {
  const navigation = useNavigation<LoginNavigationProp>();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Foreground 알림 수신
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || '📩 새 알림',
        remoteMessage.notification?.body || '알림 내용을 확인하세요.'
      );
    });
    return unsubscribe;
  }, []);

  // ✅ Background 알림 수신
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📦 Background FCM 수신:', remoteMessage);
    });
  }, []);

  // ✅ Android 알림 권한 요청
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('알림 권한 거부됨', '알림을 받을 수 없습니다.');
        return false;
      }
    }
    return true;
  };

  // ✅ FCM 토큰 요청 및 Lambda 전송
  const requestFCMPermission = async () => {
    try {
      const fcmStatus = await messaging().requestPermission();
      const enabled =
        fcmStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        fcmStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert('FCM 권한 거부됨', '푸시 알림을 받을 수 없습니다.');
        return false;
      }

      let token = await messaging().getToken();

      if (!token) {
        console.log('📛 기존 토큰 없음. 재발급 시도');
        await messaging().deleteToken();
        token = await messaging().getToken();
      }

      if (!token) {
        Alert.alert('FCM 토큰 발급 실패', '푸시 알림을 받을 수 없습니다.');
        return false;
      }

      console.log('✅ FCM Token:', token);

      await sendFcmTokenToLambda(token, id);

      Alert.alert('푸시 알림 등록 완료', '알림 수신이 정상적으로 설정되었습니다.');
      return true;
    } catch (err: any) {
      console.error('❌ FCM 요청 실패:', err);
      Alert.alert('FCM 등록 실패', err?.message || '푸시 등록 중 오류 발생');
      return false;
    }
  };

  // ✅ 로그인 처리
  const handleLogin = async () => {
    try {
      await signIn(id, password);
      Alert.alert('로그인 성공', '푸시 알림 설정을 시작합니다.');

      const granted = await requestNotificationPermission();
      if (granted) {
        const fcmRegistered = await requestFCMPermission();
        if (!fcmRegistered) return;
      }

      setIsLoggedIn(true); // ✅ 마지막에 로그인 처리
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

// ===== styled-components =====

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
