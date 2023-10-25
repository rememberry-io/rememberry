import { create } from "zustand";

type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

interface UserStore {
  user: User;

  actions: {
    addUser: (user: User) => User;
    updateUser: (user: User) => User;
  };
}

// this is a hook now
export const useUserStore = create<UserStore>();
