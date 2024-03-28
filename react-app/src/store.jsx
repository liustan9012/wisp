import jwt_decode from "jwt-decode"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export const useAuthStore = create(
  persist(
    (set, get) => ({
      auth: {},
      setUser: ({ userid, username, accessToken, refreshToken }) => {
        const isAdmin = jwt_decode(accessToken).is_admin
        set({ auth: { userid, username, accessToken, refreshToken, isAdmin } })
      },
      unsetUser: () => set({ auth: {} }),
      tokenRefresh: (accessToken) => {
        const isAdmin = jwt_decode(accessToken).is_admin
        set({ auth: { ...get().auth, accessToken, isAdmin } })
      },
    }),
    {
      name: "auth", // name of the item in the storage (must be unique)
      partialize: (state) => ({ auth: state.auth }),
      //   storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: {},
      setTheme: (newTheme) => {
        set({ theme: newTheme })
      },
    }),
    {
      name: "theme",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

export const useTagStore = create((set) => ({
  tags: [],
  selectTags: [],
  setUserTags: (tags) => {
    set(() => ({ tags: tags }))
  },
  newTag: (tag) => {
    set((state) => ({
      tags: [...state.tags, tag],
      selectTags: [...state.selectTags, tag],
    }))
  },
  setSelectTags: (tags) => {
    set(() => ({ selectTags: tags }))
  },
}))
