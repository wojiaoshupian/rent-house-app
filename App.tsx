import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MainTabNavigator, TokenStatusMonitor } from './components';
import { HomeScreen } from './screens/Home';
import { ZustandDemoScreen } from './screens/ZustandDemo';
import { RxJSDemoScreen } from './screens/RxJSDemo';
import { SubjectDemoScreen } from './screens/SubjectDemo';
import { TabBarDemoScreen } from './screens/TabBarDemo';
import { RootStackParamList } from './types/navigation';
import { RegisterScreen } from './screens/Register';
import { LoginScreen } from './screens/Login';
import { CreateBuildingScreen } from './screens/CreateBuilding';
import { BuildingListScreen } from './screens/BuildingList';
import RoomListScreen from './screens/RoomList';
import CreateRoomScreen from './screens/CreateRoom';
import CreateUtilityReadingScreen from './screens/CreateUtilityReading';
import UtilityReadingListScreen from './screens/UtilityReadingList';
import UtilityReadingDetailScreen from './screens/UtilityReadingDetail';
import EditUtilityReadingScreen from './screens/EditUtilityReading';
import BillListScreen from './screens/BillList';
import BillDetailScreen from './screens/BillDetail';
import CreateBillScreen from './screens/CreateBill';
import EditBillScreen from './screens/EditBill';
import EstimatedBillListScreen from './screens/EstimatedBillList';
import EstimatedBillEditScreen from './screens/EstimatedBillEdit';
import BillCanvasScreen from './screens/BillCanvas';
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
              name="Home"
              component={HomeScreen}
              options={{ title: '库集成演示' }}
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
              name="SubjectDemo"
              component={SubjectDemoScreen}
              options={{ title: 'RxJS Subject 演示' }}
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
            <Stack.Screen
              name="BuildingList"
              component={BuildingListScreen}
              options={{ title: '楼宇列表' }}
            />
            <Stack.Screen
              name="RoomList"
              component={RoomListScreen}
              options={{ title: '房间列表' }}
            />
            <Stack.Screen
              name="CreateRoom"
              component={CreateRoomScreen}
              options={{ title: '创建房间' }}
            />

            <Stack.Screen
              name="CreateUtilityReading"
              component={CreateUtilityReadingScreen}
              options={{ title: '抄水电表' }}
            />
            <Stack.Screen
              name="UtilityReadingList"
              component={UtilityReadingListScreen}
              options={{ title: '抄表记录' }}
            />
            <Stack.Screen
              name="UtilityReadingDetail"
              component={UtilityReadingDetailScreen}
              options={{ title: '抄表详情' }}
            />
            <Stack.Screen
              name="EditUtilityReading"
              component={EditUtilityReadingScreen}
              options={{ title: '编辑抄表记录' }}
            />
            <Stack.Screen
              name="BillList"
              component={BillListScreen}
              options={{ title: '账单列表' }}
            />
            <Stack.Screen
              name="BillDetail"
              component={BillDetailScreen}
              options={{ title: '账单详情' }}
            />
            <Stack.Screen
              name="CreateBill"
              component={CreateBillScreen}
              options={{ title: '创建账单' }}
            />
            <Stack.Screen
              name="EditBill"
              component={EditBillScreen}
              options={{ title: '编辑账单' }}
            />
            <Stack.Screen
              name="EstimatedBillList"
              component={EstimatedBillListScreen}
              options={{ title: '预估账单' }}
            />
            <Stack.Screen
              name="EstimatedBillEdit"
              component={EstimatedBillEditScreen}
              options={{ title: '编辑预估账单' }}
            />
            <Stack.Screen
              name="BillCanvas"
              component={BillCanvasScreen}
              options={{ title: '电子账单生成' }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>

        {/* 开发环境Token状态监控 */}
        <TokenStatusMonitor />
      </UserProvider>
    </SafeAreaProvider>
  );
}
