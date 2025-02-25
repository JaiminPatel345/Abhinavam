import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/types/redux.types';

export const useRedirect = () => {
  const router = useRouter();
  const isFirstRender = useRef(true);
  const redirectUrl = useSelector((state: RootState) => state.user.redirectUrl);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl]);
};