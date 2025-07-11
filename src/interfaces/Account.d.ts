export interface Account {
  _id: string;
  email: string;
  phoneNumber: string;
  password: string;
  deactivated?: boolean;
  createdAt: number;
}