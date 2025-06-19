// 앱 전체 구조와 화면 전환을 설정하는 파일
// 앱을 처음 실행했을 때 어떤 화면을 보여줄지 정하고
// 여러 화면(Home, AccountDetail 등)을 전환할 수 있도록 네비게이션 구조를 설정

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AccountDetailScreen from './screens/AccountDetailScreen';
import { RootStackParamList } from './types';

// 이 앱에 어떤 화면들이 있고, 각 화면이 어떤 이름을 가졌는지를 타입으로 알려준다.
const Stack = createNativeStackNavigator<RootStackParamList>();



export default function App() {
  return (
    <NavigationContainer>
      {/* headerShown: false는 상단에 기본 헤더(뒤로가기 버튼 등)를 숨기는 역할 */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* HomeScreen이 첫 화면이고, AccountDetailScreen은 버튼 클릭 시 전환되는 두 번째 화면 */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}