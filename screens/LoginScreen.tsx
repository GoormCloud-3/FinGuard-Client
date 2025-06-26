import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../types';
import { signIn } from '../src/cognito';
import messaging from '@react-native-firebase/messaging';

type Props = {
  setIsLoggedIn: (value: boolean) => void;
};

type LoginNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen({ setIsLoggedIn }: Props) {
  const navigation = useNavigation<LoginNavigationProp>();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Foreground 수신 처리
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || '📩 새 알림',
        remoteMessage.notification?.body || '알림 내용을 확인하세요.'
      );
    });

    return unsubscribe;
  }, []);

  // ✅ Background 수신 처리 (앱이 꺼져 있어도 작동)
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📦 Background FCM 수신:', remoteMessage);
    });
  }, []);

  // ✅ Android 알림 권한 요청 (13 이상)
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

  // ✅ FCM 권한 및 토큰 요청
  const requestFCMPermission = async () => {
    try {
      const fcmStatus = await messaging().requestPermission();
      const enabled =
        fcmStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        fcmStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert('FCM 권한 거부됨', '푸시 알림을 받을 수 없습니다.');
        return;
      }

      const token = await messaging().getToken();
      console.log('✅ FCM Token:', token);
      Alert.alert('FCM 토큰 발급됨', token);

      // TODO: 이 토큰을 SNS 또는 Lambda에 전송
    } catch (err) {
      console.error('❌ FCM 요청 실패:', err);
    }
  };

  // ✅ 로그인 처리 후 권한 요청
  const handleLogin = async () => {
    try {
      await signIn(id, password);
      Alert.alert('로그인 성공', '환영합니다!');
      setIsLoggedIn(true);

      const granted = await requestNotificationPermission();
      if (granted) {
        await requestFCMPermission();
      }
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
