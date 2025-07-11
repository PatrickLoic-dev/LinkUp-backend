export interface Account {
  id: string;
  email: string;
  phoneNumber: string;
  password: string;
  deactivated?: boolean;
}