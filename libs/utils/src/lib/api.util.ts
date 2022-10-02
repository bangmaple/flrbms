
interface LoginRequest {
  username: string;
  password: string;
}

export const AUTH_API = {
  loginWithGoogle: '/api/v1/signin/google',
  login: '/api/v1/signin',
  logout: '/api/v1/signout',
  refreshToken: '/api/v1/refreshToken'
}
