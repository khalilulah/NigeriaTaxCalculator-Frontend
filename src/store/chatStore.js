import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set) => ({
      chatMessages: [
        {
          role: "assistant",
          content:
            "Hello! I'm your Nigeria Tax Assistant. Ask me anything about Nigeria's 2025 tax reforms and I'll help you understand the new tax laws.",
          timestamp: "",
        },
      ],

      addMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      clearChat: () =>
        set({
          chatMessages: [],
        }),
    }),
    {
      name: "chat-storage", // change to sessionStorage below if you want
      //   storage: createJSONStorage(() => sessionStorage),
    }
  )
);
