import { useEffect, useRef } from "react";
import styles from "./FollowMouse.module.css";

export default function FollowMouse() {
  const pointerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={styles.container}
      onMouseMove={(e) => {
        const y = e.pageY - e.currentTarget.offsetTop;
        const x = e.pageX - e.currentTarget.offsetLeft;
        if (y < 0 || x < 0) return;

        pointerRef.current?.style.setProperty(
          "transform",
          `translate(${x - 20}px, ${y - 20}px) rotate(45deg)`
        );
      }}
    >
      <div className={styles.pointer} ref={pointerRef} />
    </div>
  );
}
