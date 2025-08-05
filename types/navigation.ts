import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  ZustandDemo: undefined;
  RxJSDemo: undefined;
  SubjectDemo: undefined;
  LodashDemo: undefined;
  LibraryDemo: undefined;
  TabBarDemo: undefined;
  Register: undefined;
  Login: undefined;
  CreateBuilding: undefined;
  BuildingList: undefined;
  RoomList: { buildingId?: number };
  CreateRoom: { buildingId?: number };
  CreateUtilityReading: { roomId?: number };
  UtilityReadingList: { roomId?: number; buildingId?: number };
  UtilityReadingDetail: { readingId: number };
  EditUtilityReading: { readingId: number };

  // 账单相关
  BillList: { roomId?: number; buildingId?: number };
  BillDetail: { billId: number };
  CreateBill: { roomId?: number };
  EditBill: { billId: number };

  // 预估账单相关
  EstimatedBillList: { roomId?: number; buildingId?: number };
  EstimatedBillDetail: { billId: number };
};

export type RootNavigatorParamList = RootStackParamList;
