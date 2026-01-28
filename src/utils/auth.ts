interface User {
  id: string;
  email: string;
  userType: 'farmer' | 'company' | 'admin';
  name?: string;
  companyName?: string;
}

export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setCurrentUser(user: User) {
  localStorage.setItem('current_user', JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  const userData = localStorage.getItem('current_user');
  return userData ? JSON.parse(userData) : null;
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
