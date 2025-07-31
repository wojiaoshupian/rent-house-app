import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  counter: number;
  user: {
    name: string;
    email: string;
  };
  todos: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

interface AppActions {
  increment: () => void;
  decrement: () => void;
  setUser: (name: string, email: string) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

type AppStore = AppState & AppActions;

export const useStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // State
      counter: 0,
      user: {
        name: '',
        email: '',
      },
      todos: [],

      // Actions
      increment: () => set((state) => ({ counter: state.counter + 1 })),
      decrement: () => set((state) => ({ counter: state.counter - 1 })),
      
      setUser: (name: string, email: string) =>
        set({ user: { name, email } }),
      
      addTodo: (text: string) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: Date.now().toString(),
              text,
              completed: false,
            },
          ],
        })),
      
      toggleTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      
      removeTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    }),
    {
      name: 'app-store',
    }
  )
); 