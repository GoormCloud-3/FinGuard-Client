import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();

import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import RegisterPinScreen from './screens/RegisterPinScreen';
import HomeScreen from './screens/HomeScreen';
import AccountDetailScreen from './screens/AccountDetailScreen';
import SendMoneyScreen from './screens/SendMoneyScreen';
import EnterAmountScreen from './screens/EnterAmountScreen';
import CreateAccountScreen from './screens/CreateAccountScreen'; 

import { RootStackParamList } from './types';

import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 [Foreground] FCM 수신:', JSON.stringify(remoteMessage, null, 2));
      Alert.alert(
        remoteMessage.notification?.title || '📩 새 알림',
        remoteMessage.notification?.body || '알림 내용을 확인하세요.'
      );
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📦 [Background] FCM 수신:', JSON.stringify(remoteMessage, null, 2));
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="RegisterPin" component={RegisterPinScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => <HomeScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
            <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
            <Stack.Screen name="EnterAmount" component={EnterAmountScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} /> 
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
