"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/motion";
export function ProductGallery({
  image,
  name,
}: {
  image: string;
  name: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [detail, setDetail] = useState(false);
  const gallery = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      const image = gallery.current?.querySelector(".gallery-main > img");
      if (image) {
        gsap.killTweensOf(image);
        gsap.set(image, {
          scale: detail ? 1.68 : 1,
          transformOrigin: "50% 33%",
        });
      }
    };
    preference.addEventListener("change", settle);
    return () => preference.removeEventListener("change", settle);
  }, [detail]);
  useGSAP(
    () => {
      gsap.to(gallery.current!.querySelector(".gallery-main > img")!, {
        scale: detail ? 1.68 : 1,
        transformOrigin: "50% 33%",
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 0.8,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    },
    { scope: gallery, dependencies: [detail] },
  );
  return (
    <div className="gallery" ref={gallery}>
      <div className={`gallery-main ${detail ? "gallery-detail" : ""}`}>
        <Image
          src={image}
          alt={`${name} — source catalogue design`}
          width={650}
          height={1270}
          priority
          sizes="(max-width:760px) 85vw, 45vw"
        />
        <button
          className="zoom-button"
          onClick={() => dialog.current?.showModal()}
          aria-label="Enlarge door image"
        >
          <Maximize2 size={19} />
        </button>
      </div>
      <div className="gallery-controls">
        <button onClick={() => setDetail(false)} aria-pressed={!detail}>
          Full design
        </button>
        <button onClick={() => setDetail(true)} aria-pressed={detail}>
          Closer look
        </button>
        <span>Original catalogue image</span>
      </div>
      <dialog
        aria-label={`${name} enlarged design`}
        className="image-dialog"
        ref={dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          aria-label="Close enlarged image"
          autoFocus
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <Image
          src={image}
          alt={`${name}, enlarged original design`}
          width={650}
          height={1270}
        />
      </dialog>
    </div>
  );
}
