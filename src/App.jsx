import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodo,
  removeTodo,
  changeStateTodo,
  clearAllTodos,
} from "./features/todoSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.todoState);
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputRef.current.value.trim()) {
      const newTodo = {
        id: Math.random(),
        text: inputRef.current.value,
        completed: false,
      };
      dispatch(addTodo(newTodo));
      inputRef.current.value = "";
    } else {
      alert("Please enter information");
    }
  };

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const iconRef = useRef(null);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem("isDarkTheme", JSON.stringify(newTheme));
      return newTheme;
    });
  };

  useEffect(() => {
    const savedTheme = JSON.parse(localStorage.getItem("isDarkTheme"));
    if (savedTheme !== null) {
      setIsDarkTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkTheme);
    if (iconRef.current) {
      iconRef.current.src = isDarkTheme
        ? "./assets/icon-sun.svg"
        : "./assets/icon-moon.svg";
    }
    const box = document.querySelector(".box");
    if (box) {
      box.style.backgroundImage = isDarkTheme
        ? 'url("../public/assets/bg-desktop-dark.jpg")'
        : 'url("../public/assets/bg-desktop-light.jpg")';
    }
  }, [isDarkTheme]);

  const clearTodos = () => {
    localStorage.removeItem("todos");
    dispatch(clearAllTodos());
  };

  // Filter states and functions
  const [filter, setFilter] = useState("all");

  const handleFilter = (filterType) => {
    setFilter(filterType);
  };

  // Filtering todos based on filter state
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div>
      <div className="box">
        <div className="container">
          <div className="topBox">
            <h2 className="topBox__title">TODO</h2>
            <button onClick={toggleTheme} className="modeBtn">
              <img
                ref={iconRef}
                className="modeImg"
                src="./assets/icon-moon.svg"
                alt="Toggle Theme Icon"
              />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="formImg"></div>
            <input
              ref={inputRef}
              className="formInput"
              placeholder="Create a new todo…"
              type="text"
            />
          </form>
          <ul className="list">
            {filteredTodos.map((item) => (
              <li
                className={`listItem group ${
                  item.completed ? "completed" : ""
                }`}
                key={item.id}
              >
                <button
                  className="checkBtn"
                  onClick={() => dispatch(changeStateTodo(item.id))}
                >
                  <img
                    src={
                      item.completed
                        ? "./assets/icon-check.svg"
                        : "./assets/circle.svg"
                    }
                    alt=""
                  />
                </button>
                <h3 className={`itemTitle ${item.completed ? "checked" : ""}`}>
                  {item.text}
                </h3>
                <button
                  className="deleteBtn"
                  onClick={() => dispatch(removeTodo(item.id))}
                >
                  <img src="./assets/icon-cross.svg" alt="" />
                </button>
              </li>
            ))}
          </ul>
          <div className="allFilters">
            <h4 className="todoNumber">
              <span>{filteredTodos.length}</span> items left
            </h4>
            <div className="centerBtn">
              <button
                className="allBtn btn"
                onClick={() => handleFilter("all")}
              >
                All
              </button>
              <button
                className="activeBtn btn"
                onClick={() => handleFilter("active")}
              >
                Active
              </button>
              <button
                className="completedBtn btn"
                onClick={() => handleFilter("completed")}
              >
                Completed
              </button>
            </div>
            <button className="clearBtn btn" onClick={clearTodos}>
              Clear All
            </button>
          </div>
          <h4 className="lastTitle">Drag and drop to reorder list</h4>
        </div>
      </div>
    </div>
  );
}

export default App;
