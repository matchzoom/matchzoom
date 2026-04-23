import { useMutation } from '@tanstack/react-query';
import { testLogin } from '@/shared/api/authApi';

export function useTestLogin() {
  return useMutation({
    mutationFn: testLogin,
    onSuccess: () => {
      window.location.href = '/';
    },
  });
}
