import { create, StateCreator } from "zustand";

import { immer } from "zustand/middleware/immer";
import createSelectors from "./selector";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

type AuthState = {
  access_token: string | null;
  user: null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
};

const createAuthSlice: StateCreator<AuthState> = (set) => ({
  access_token: null,
  user: null,
  setAccessToken: (token: string) => set({ access_token: token }),
  clearAccessToken: () => set({ access_token: null }),
});

type StoreType = AuthState;
export const useStoreBase = create<StoreType>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({
          ...createAuthSlice(...a),
        }))
      ),
      {
        name: "session-storage", // Name of the item in localStorage (or sessionStorage)
        getStorage: () => sessionStorage, // (optional) by default it's localStorage
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);
