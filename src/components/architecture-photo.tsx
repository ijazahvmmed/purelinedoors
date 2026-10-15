import Image from "next/image";

const photographs = {
  "residential-exterior": {
    creator: "Max Vakhtbovych",
    alt: "Contemporary stone-clad home and landscaped approach",
    position: "50% 48%",
  },
  "woodland-entrance": {
    creator: "Nici Gottstein",
    alt: "A warmly lit contemporary entrance amongst mature trees",
    position: "50% 57%",
  },
  "quiet-interior": {
    creator: "Max Vakhtbovych",
    alt: "A restrained residential entrance hall with warm flooring and a neutral palette",
    position: "50% 55%",
  },
  "public-interior": {
    creator: "ready made",
    alt: "Natural light and shadows in a public interior with timber-lined walls",
    position: "50% 55%",
  },
};

export function ArchitecturePhoto({
  name,
  className = "",
}: {
  name: keyof typeof photographs;
  className?: string;
}) {
  const photo = photographs[name];
  return (
    <figure className={`architecture-photo ${className}`}>
      <div className="architecture-aperture">
        <div className="architecture-parallax" data-parallax>
          <Image
            src={`/images/architecture/${name}.webp`}
            alt={`${photo.alt}; architectural inspiration, not a Pureline installation`}
            fill
            sizes="(max-width:760px) 90vw, 48vw"
            style={{ objectPosition: photo.position }}
          />
        </div>
      </div>
      <figcaption>
        Architectural inspiration <span>{photo.creator} / Pexels</span>
      </figcaption>
    </figure>
  );
}
