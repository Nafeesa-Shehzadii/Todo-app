import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Todo type
export type Todo = {
  id: number;
  val: string;
  isDone: boolean;
  date: string;
};

// Define initial state
interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

// Create the todo slice
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    editTodo: (
      state,
      action: PayloadAction<{ id: number; val: string; date: string }>
    ) => {
      const { id, val, date } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.val = val;
        todo.date = date;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.isDone = !todo.isDone;
      }
    },
  },
});

// Export actions for use in components
export const { addTodo, editTodo, deleteTodo, toggleTodo } = todoSlice.actions;

// Export the reducer to be used in the store
export default todoSlice.reducer;
