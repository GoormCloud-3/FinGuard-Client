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


type Props = { setIsLoggedIn: (v: boolean) => void };
type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen({ setIsLoggedIn }: Props) {
  const navigation = useNavigation<LoginNavProp>();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');


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

 
  const setupFCM = async (): Promise<string | null> => {
    try {
    
      const perm = await messaging().requestPermission();
      const enabled =
        perm === messaging.AuthorizationStatus.AUTHORIZED ||
        perm === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        Alert.alert('FCM 권한 거부됨', '푸시 알림을 받을 수 없습니다.');
        return null;
      }

    
      await deleteFcmToken();
      await messaging().deleteToken();

     
      const token = await messaging().getToken();
      if (!token) {
        Alert.alert('FCM 토큰 발급 실패', '푸시 알림을 받을 수 없습니다.');
        return null;
      }

      console.log('✅ 새 FCM Token:', token);

     
      await saveFcmToken(token);

     
      return token;
    } catch (e: any) {
      console.error('❌ FCM 설정 실패:', e);
      Alert.alert('FCM 설정 실패', e?.message ?? '오류가 발생했습니다.');
      return null;
    }
  };

  
  const handleLogin = async () => {
    try {
     
      await AsyncStorage.multiRemove(['@userSub', '@fcmToken']);

    
      const { sub, idToken } = await signIn(id, pw);

     
      await AsyncStorage.setItem('@userSub', sub);
      await Keychain.setGenericPassword('jwt', idToken, { service: 'id_token' });

     
      const granted = await requestNotifPermission();
      if (granted) {
        await setupFCM(); 
      }

      
      setIsLoggedIn(true);
    } catch (e: any) {
      Alert.alert('로그인 실패', e?.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };


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
        autoCapitalize="none"
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

const BackBtn = styled.TouchableOpacity`
  padding: 12px;
`;
const BackTxt = styled.Text`
  color: #fff;
  font-size: 36px;
`;

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