import { useState } from "react";
import styles from "./FlipSwitch.module.css";

export default function FlipSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      className={styles.flipSwitch}
      role="switch"
      aria-checked={isOn}
      onClick={() => setIsOn((on) => !on)}
    />
  );
}
