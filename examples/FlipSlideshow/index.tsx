import { useState } from "react";
import Image from "next/image";
import styles from "./FlipSlideshow.module.css";

const images = [
  "/images/charmander.png",
  "/images/charmeleon.png",
  "/images/charizard.png",
];

const pokemon = [
  { name: "Charmander", img: "/images/charmander.png" },
  { name: "Charmeleon", img: "/images/charmeleon.png" },
  { name: "Charizard", img: "/images/charizard.png" },
];

export default function FlipSlideshow() {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <button
        onClick={() => setIndex((i) => (i + 1 >= images.length ? 0 : i + 1))}
      >
        Next Pokemon
      </button>
      <div className={styles.imagesWrapper}>
        {pokemon.map(({ name, img }, i) => (
          <div className={styles.img} aria-hidden={i !== index}>
            <Image height={200} width={200} src={img} alt={name} />
          </div>
        ))}
      </div>
    </div>
  );
}
