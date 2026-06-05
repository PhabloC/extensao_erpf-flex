import { apiClient } from '@/services/http/apiClient';
import type { AuthSession } from '@/types/auth';

interface BootstrapSessionInput {
  name: string;
  email: string;
  password: string;
}

interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

async function signIn(email: string, password: string) {
  const response = await apiClient.post<AuthResponseDto>('/auth/login', {
    email,
    password,
  });

  return response.data;
}

async function provisionUser(input: BootstrapSessionInput) {
  await apiClient.post('/users', {
    name: input.name,
    email: input.email,
    password: input.password,
    role: 'admin',
  });
}

export async function bootstrapSession(
  input: BootstrapSessionInput,
): Promise<AuthSession> {
  try {
    const session = await signIn(input.email, input.password);

    return {
      accessToken: session.accessToken,
      user: session.user,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication failed.';

    if (!/invalid credentials/i.test(message)) {
      throw error;
    }
  }

  await provisionUser(input);

  const session = await signIn(input.email, input.password);

  return {
    accessToken: session.accessToken,
    user: session.user,
  };
}
