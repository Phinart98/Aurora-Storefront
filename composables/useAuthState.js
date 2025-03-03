export const useAuthState = () => useState('auth', () => ({
  isAuthenticating: false
}))
