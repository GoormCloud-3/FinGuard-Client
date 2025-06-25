import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();

import React, { useState } from 'react';
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

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
