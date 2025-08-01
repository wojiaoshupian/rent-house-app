import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { userService, RegisterRequest } from '../../services/userService';
import { useUser } from '../../contexts/UserContext';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegisterForm } from './RegisterForm';
import { validateRegisterForm } from './validation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    confirmPhone: '',
  });

  // 更新表单数据
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    if (!validateRegisterForm(formData)) return;

    setLoading(true);

    const registerData: RegisterRequest = {
      username: formData.username.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      roles: ['USER'],
    };

    // 使用封装好的用户服务
    userService
      .register(registerData)
      .pipe(
        catchError((error) => {
          console.error('注册失败:', error);
          const errorMessage = error.message || '注册失败，请重试';
          Alert.alert('注册失败', errorMessage);
          return of(null);
        })
      )
      .subscribe({
        next: (user) => {
          setLoading(false);
          if (user) {
            // 将用户信息存储到 Context 中
            setUser(user);
            console.log('👤 用户信息已存储到 Context:', user);

            Alert.alert('注册成功', `用户 ${user.username} 注册成功！`, [
              {
                text: '确定',
                onPress: () => navigation.goBack(),
              },
            ]);
            // 清空表单
            setFormData({
              username: '',
              password: '',
              confirmPassword: '',
              phone: '',
              confirmPhone: '',
            });
          }
        },
        error: (error) => {
          console.error('RxJS错误:', error);
          setLoading(false);
          Alert.alert('错误', '网络请求失败，请检查网络连接');
        },
      });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <RegisterForm
        formData={formData}
        updateFormData={updateFormData}
        onRegister={handleRegister}
        loading={loading}
        onBack={() => navigation.goBack()}
      />
    </View>
  );
};
