export interface Todo {
  ID: string;
  Title: string;
  Completed: boolean;
  OwnerID: string;
}

export interface User {
  id: string;
  email: string;
  picture: string;
  name: string;
  roles: [string]
}
export interface UserCache {
  [key: string]: User;
}
