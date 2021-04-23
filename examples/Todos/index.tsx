import { useLayoutEffect, useRef, useState } from "react";
import styles from "./Todos.module.css";

interface Todo {
  label: string;
  lastRect: Rect | null;
  done: boolean;
}

interface Rect {
  top: number;
  left: number;
}

export default function Todos() {
  const [allTodos, setAllTodos] = useState<Todo[]>([
    { label: "Wash the dishes", lastRect: null, done: false },
    { label: "Take out the trash", lastRect: null, done: false },
    { label: "Mow the lawn", lastRect: null, done: true },
  ]);

  const toggleTodo = (todo: Todo) => {
    setAllTodos((prevTodos) => {
      const index = prevTodos.findIndex((t) => t.label === todo.label);
      if (index === -1) return prevTodos;
      const result = Array.from(prevTodos);
      result.splice(index, 1);
      result.push(todo);
      return result;
    });
  };

  return (
    <div className={styles.todosContainer}>
      <div className={styles.todoColumn}>
        <strong>To Do</strong>
        {allTodos
          .filter((t) => !t.done)
          .map((t) => (
            <TodoItem
              key={t.label}
              label={t.label}
              done={t.done}
              lastRect={t.lastRect}
              toggleTodo={toggleTodo}
            />
          ))}
      </div>
      <div className={styles.todoColumn}>
        <strong>Done</strong>
        {allTodos
          .filter((t) => t.done)
          .map((t) => (
            <TodoItem
              key={t.label}
              label={t.label}
              done={t.done}
              lastRect={t.lastRect}
              toggleTodo={toggleTodo}
            />
          ))}
      </div>
    </div>
  );
}

function TodoItem(props: {
  label: string;
  done: boolean;
  lastRect: { top: number; left: number } | null;
  toggleTodo: (todo: Todo) => void;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const lastRectRef = useRef(props.lastRect);
  useLayoutEffect(() => {
    if (!divRef.current) return;
    const left = divRef.current.offsetLeft;
    const top = divRef.current.offsetTop;
    const lastRect = lastRectRef.current;
    if (lastRect && (lastRect.left !== left || lastRect.top !== top)) {
      const xOffset = lastRect.left - left;
      const yOffset = lastRect.top - top;
      divRef.current.animate(
        [
          { transform: `translate(${xOffset}px, ${yOffset}px)` },
          { transform: "translate(0, 0)" },
        ],
        { duration: 200 }
      );
    }

    lastRectRef.current = { left, top };
  });

  return (
    <div className={styles.todoItem} ref={divRef}>
      <input
        type="checkbox"
        id={props.label}
        onClick={() => {
          if (!divRef.current) return;
          const top = divRef.current.offsetTop;
          const left = divRef.current.offsetLeft;
          props.toggleTodo({
            label: props.label,
            lastRect: { top, left },
            done: !props.done,
          });
        }}
        checked={props.done}
      />
      <label htmlFor={props.label}>{props.label}</label>
    </div>
  );
}
