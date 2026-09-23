export interface LoginResult {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: {
    access_token: string;
    refresh_token: string;
  };
}
