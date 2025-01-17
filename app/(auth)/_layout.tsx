import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';

const AuthLayout = () => {
  const { session } = useAuth();

  if (session) {
    return <Redirect href={'/'} />;
  }

  return <Stack />;
};

export default AuthLayout;