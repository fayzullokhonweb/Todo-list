import { createSlice } from "@reduxjs/toolkit";

function dataFromLocalStorage() {
  return (
    JSON.parse(localStorage.getItem("todos")) || {
      todos: [],
    }
  );
}

export const todoSlice = createSlice({
  name: "todo",
  initialState: dataFromLocalStorage,
  reducers: {
    addTodo: (state, { payload }) => {
      state.todos.push(payload);
      todoSlice.caseReducers.setLocal(state);
    },
    removeTodo: (state, { payload }) => {
      const filteredTodos = state.todos.filter((item) => item.id !== payload);
      state.todos = filteredTodos;
      todoSlice.caseReducers.setLocal(state);
    },

    changeStateTodo: (state, { payload }) => {
      const item = state.todos.find((item) => item.id == payload);
      item.completed = !item.completed;
      todoSlice.caseReducers.setLocal(state);
    },
    setLocal: (state) => {
      localStorage.setItem("todos", JSON.stringify(state));
    },
    clearAllTodos: (state) => {
      state.todos = [];
      localStorage.removeItem("todos");
    },
  },
});

export const { addTodo, removeTodo, changeStateTodo, clearAllTodos } =
  todoSlice.actions;
export default todoSlice.reducer;
