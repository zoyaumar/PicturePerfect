import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { generateUsername } from '@/hooks/useUserData';

const AuthLayout = () => {
  const { session } = useAuth();

  if (session) {
    generateUsername()
    return <Redirect href={'/'} />;
  }

  return <Stack />;
};

export default AuthLayout;