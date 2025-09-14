export interface CreateUserDto {
  name: string;
  email: string;
  age: number;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}
