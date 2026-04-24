import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { testLogin } from '@/shared/api/authApi';

export function useTestLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: testLogin,
    onSuccess: () => {
      router.refresh();
    },
  });
}
