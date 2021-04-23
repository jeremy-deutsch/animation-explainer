import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import styles from "./Collapsible.module.css";

export default function Collapsible(props: {
  title: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  const childrenRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (!childrenRef.current) return;

    // if any animations are still running it'll mess up our measurement
    childrenRef.current.getAnimations().forEach((a) => a.cancel());

    // compare the old and new height, then animate between them
    const childrenHeight = childrenRef.current.offsetHeight;
    const prevHeight = prevHeightRef.current;
    if (prevHeight !== null && prevHeight !== childrenHeight) {
      childrenRef.current.animate(
        [{ height: `${prevHeight}px` }, { height: `${childrenHeight}px` }],
        { duration: 300, fill: "none", easing: "ease-in-out" }
      );
    }

    prevHeightRef.current = childrenHeight;
  }, [expanded]);

  return (
    <div>
      <button
        className={styles.titleButton}
        aria-expanded={expanded}
        onClick={() => {
          if (childrenRef.current) {
            prevHeightRef.current = childrenRef.current.offsetHeight;
          }
          setExpanded((e) => !e);
        }}
      >
        {props.title}
      </button>
      <div
        ref={childrenRef}
        className={styles.children}
        aria-hidden={!expanded}
      >
        {props.children}
      </div>
    </div>
  );
}
