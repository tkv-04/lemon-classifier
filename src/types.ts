export interface LemonStats {
  ripe: number;
  unripe: number;
  damaged: number;
}

export interface CurrentLemon {
  id: string;
  ripeness: number;
  status: 'ripe' | 'unripe' | 'damaged';
  red: number;
  green: number;
  blue: number;
  timestamp: number;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
  // Add other user properties if needed
}

export interface AuthStore {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}