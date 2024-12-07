export interface User {
  id?: number;
  username: string;
  age: number;
  status: 'active' | 'inactive';
  email: string;
}