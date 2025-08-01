import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LoginHeader } from './components/LoginHeader';
import { LoginFields } from './components/LoginFields';
import { RegisterLink } from './components/RegisterLink';
import { DemoInfo } from './components/DemoInfo';

interface LoginFormProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  onLogin: () => void;
  loading: boolean;
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  setUsername,
  setPassword,
  onLogin,
  loading,
  onNavigateToRegister,
}) => {
  return (
    <ScrollView className="flex-1 px-6 py-4">
      {/* Header */}
      <LoginHeader />

      {/* Login Form */}
      <LoginFields
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        onLogin={onLogin}
        loading={loading}
      />

      {/* Register Link */}
      <RegisterLink onNavigateToRegister={onNavigateToRegister} />

      {/* Demo Info */}
      <DemoInfo />
    </ScrollView>
  );
};
