export interface UserSchema {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface Login {
  identifier: string;
  password: string;
}
