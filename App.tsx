import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MainTabNavigator } from './components/MainTabNavigator';
import { ZustandDemoScreen } from './screens/ZustandDemoScreen';
import { RxJSDemoScreen } from './screens/RxJSDemoScreen';
import { LodashDemoScreen } from './screens/LodashDemoScreen';
import { LibraryDemoScreen } from './screens/LibraryDemoScreen';
import { TabBarDemoScreen } from './screens/TabBarDemoScreen';
import { RootStackParamList } from './types/navigation';
import { RegisterScreen } from './screens/RegisterScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8fafc',
            },
            headerTintColor: '#1f2937',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Main" 
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ZustandDemo" 
            component={ZustandDemoScreen}
            options={{ title: 'Zustand 状态管理' }}
          />
          <Stack.Screen 
            name="RxJSDemo" 
            component={RxJSDemoScreen}
            options={{ title: 'RxJS 响应式编程' }}
          />
          <Stack.Screen 
            name="LodashDemo" 
            component={LodashDemoScreen}
            options={{ title: 'Lodash 工具库' }}
          />
          <Stack.Screen 
            name="LibraryDemo" 
            component={LibraryDemoScreen}
            options={{ title: '综合库演示' }}
          />
          <Stack.Screen 
            name="TabBarDemo" 
            component={TabBarDemoScreen}
            options={{ title: '动态 TabBar 演示' }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: '用户注册' }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
