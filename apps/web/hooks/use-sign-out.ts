'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import pathsConfig from '~/config/paths.config';

export function useSignOut() {
  const router = useRouter();

  return () => {
    // Remove all three tokens
    Cookies.remove('id_token');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');

    // Redirect to the sign-in page
    router.push(pathsConfig.auth.signIn);
    router.refresh();
  };
} 