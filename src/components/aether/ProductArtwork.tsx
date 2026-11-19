import { useState } from "react";

export function ProductArtwork({
  src,
  alt,
  brand,
  className = "",
}: {
  src: string | null;
  alt: string;
  brand?: string | null;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      {src && failedSrc !== src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-aurora px-6 text-center">
          <div>
            <p className="font-display text-3xl text-platinum/80">{brand ?? "Aether"}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-platinum/50">{alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}
