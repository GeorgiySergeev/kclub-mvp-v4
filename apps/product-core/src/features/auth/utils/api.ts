export type AuthResponse<T = any> = {
  success: boolean;
  data?: T;
  errorCode?: string;
};

export async function parseAuthResponse<T = any>(res: Response): Promise<AuthResponse<T>> {
  try {
    const body = await res.json();

    // The shared API envelope: success is response.ok && body.error === null
    if (res.ok && body.error === null) {
      return { success: true, data: body.data };
    }

    // Failures read body.error.code
    const errorCode = body.error?.code || 'generic';
    return { success: false, errorCode };
  } catch (err) {
    return { success: false, errorCode: 'generic' };
  }
}
