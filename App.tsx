import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MainTabNavigator } from './components';
import { ZustandDemoScreen } from './screens/ZustandDemo';
import { RxJSDemoScreen } from './screens/RxJSDemo';
import { SubjectDemoScreen } from './screens/SubjectDemo';
import { LodashDemoScreen } from './screens/LodashDemo';
import { LibraryDemoScreen } from './screens/LibraryDemo';
import { TabBarDemoScreen } from './screens/TabBarDemo';
import { RootStackParamList } from './types/navigation';
import { RegisterScreen } from './screens/Register';
import { LoginScreen } from './screens/Login';
import { CreateBuildingScreen } from './screens/CreateBuilding';
import { UserProvider } from './contexts/UserContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
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
            }}>
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
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
              name="SubjectDemo"
              component={SubjectDemoScreen}
              options={{ title: 'RxJS Subject 演示' }}
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
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: '用户登录' }}
            />
            <Stack.Screen
              name="CreateBuilding"
              component={CreateBuildingScreen}
              options={{ title: '创建楼宇' }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}
