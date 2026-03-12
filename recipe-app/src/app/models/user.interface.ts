export interface UserSettings {
  readingDelay: number;
  darkMode: boolean;
}

export interface User {
  id: string;
  username: string;
  password: string;
  settings: UserSettings;
}
