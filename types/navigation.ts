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
  RoomDetail: { roomId: number };
  CreateUtilityReading: { roomId?: number };
  UtilityReadingList: { roomId?: number; buildingId?: number };
  UtilityReadingDetail: { readingId: number };
  EditUtilityReading: { readingId: number };
};

export type RootNavigatorParamList = RootStackParamList;
