// import { create } from "zustand";

import { Node } from "reactflow"

// export type Stack = {
//   userId: string;
//   username: string;
//   email: string;
// };

// interface StackStore {
//   user: Stack | null;

//   isLoading: boolean;

//   isLoggedIn: boolean;

//   actions: {
//     setUser: (user: RegisterUserOutput) => RegisterUserOutput;
//     deleteUser: () => void;
//     setLoading: (loading: boolean) => void;
//     setLoggedIn: (loggedIn: boolean) => void;
//   };
// }

// export const useStackStore = create<StackStore>((set) => ({
//   user: null,
//   isLoading: false,
//   isLoggedIn: false,
//   actions: {
//     setUser: (user): RegisterUserOutput => {
//       set(() => ({
//         user: user,
//       }));
//       return user;
//     },
//     deleteUser() {
//       set(() => ({
//         user: null,
//       }));
//     },
//     setLoading(loading) {
//       set(() => ({
//         isLoading: loading,
//       }));
//     },
//     setLoggedIn(loggedIn) {
//       set(() => ({
//         isLoggedIn: loggedIn,
//       }));
//     },
//   },
// }));
//

type Stack = {
  node: Node;
  name: string;
  description: string;
  parentStackId: string;
  createdAt: Date;
  updatedAt: Date;
  mapId: string;
}

type Flashcard = {
  node: Node;
  name: string;
  description: string;
  parentStackId: string;
  createdAt: Date;
  updatedAt: Date;
}

type CardNode = Stack | Flashcard;

interface CardNodeStore {
  nodes: CardNode[]
}
