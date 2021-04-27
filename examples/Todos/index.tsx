import { AnimateSharedLayout, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./Todos.module.css";

interface Todo {
  label: string;
  lastRect?: Rect;
  done: boolean;
}

interface Rect {
  top: number;
  left: number;
}

export default function Todos() {
  const [allTodos, setAllTodos] = useState<Todo[]>([
    { label: "Wash the dishes", done: false },
    { label: "Take out the trash", done: false },
    { label: "Mow the lawn", done: true },
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

  const [shouldUseFramerMotion, setShouldUseFramerMotion] = useState(false);

  const renderTodoItem = (todo: Todo) =>
    shouldUseFramerMotion ? (
      <FramerMotionTodoItem
        key={todo.label}
        {...todo}
        toggleTodo={toggleTodo}
      />
    ) : (
      <FLIPTodoItem key={todo.label} {...todo} toggleTodo={toggleTodo} />
    );

  return (
    <div className={styles.container}>
      <div className={styles.useFramerMotionContainer}>
        <input
          type="checkbox"
          id="use-framer-motion"
          checked={shouldUseFramerMotion}
          onChange={(e) => {
            // erase all the lastRects
            setAllTodos((prevTodos) =>
              prevTodos.map(({ label, done }) => ({ label, done }))
            );
            setShouldUseFramerMotion(e.target.checked);
          }}
        />
        <label htmlFor="use-framer-motion">Use Framer Motion?</label>
      </div>
      <AnimateSharedLayout>
        <div className={styles.todosContainer}>
          <div className={styles.todoColumn}>
            <strong>To Do</strong>
            {allTodos.filter((t) => !t.done).map(renderTodoItem)}
          </div>
          <div className={styles.todoColumn}>
            <strong>Done</strong>
            {allTodos.filter((t) => t.done).map(renderTodoItem)}
          </div>
        </div>
      </AnimateSharedLayout>
    </div>
  );
}

function FLIPTodoItem(props: {
  label: string;
  done: boolean;
  lastRect?: { top: number; left: number };
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
        { easing: "linear", duration: 200 }
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

function FramerMotionTodoItem(props: {
  label: string;
  done: boolean;
  toggleTodo: (todo: Todo) => void;
}) {
  return (
    <motion.div
      className={styles.todoItem}
      transition={{ ease: "linear", duration: 0.2 }}
      layoutId={props.label}
    >
      <input
        type="checkbox"
        id={props.label}
        onClick={() => {
          props.toggleTodo({ label: props.label, done: !props.done });
        }}
        checked={props.done}
      />
      <label htmlFor={props.label}>{props.label}</label>
    </motion.div>
  );
}
