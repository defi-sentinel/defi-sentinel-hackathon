"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getProtocolLogo } from "@/lib/getProtocolLogo";

interface ProtocolLogoProps {
  name: string;
  slug?: string;
  logoUrl?: string | null;
  className?: string;
  fallbackContent?: React.ReactNode;
}

export function ProtocolLogo({
  name,
  slug,
  logoUrl,
  className = "w-8 h-8",
  fallbackContent
}: ProtocolLogoProps) {
  // Use helper to determine best initial source (local optimized or external)
  const getInitialSrc = () => {
    if (slug) {
      return getProtocolLogo({ slug, logo: logoUrl || undefined });
    }
    // Fallback for when slug isn't provided (legacy behavior, though we should always pass slug)
    return logoUrl || `/protocols/${name.toLowerCase()}.webp`;
  };

  const [src, setSrc] = useState(getInitialSrc());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setSrc(getInitialSrc());
    setHasError(false);
  }, [name, slug, logoUrl]);

  const handleError = () => {
    // If we failed to load from a local path, try the external URL
    if (src.startsWith('/protocols/')) {
      if (logoUrl && src !== logoUrl) {
        setSrc(logoUrl);
      } else {
        setHasError(true);
      }
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`${className} rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 overflow-hidden`}>
        {fallbackContent || <span className="text-sm">🛡️</span>}
      </div>
    );
  }

  return (
    <div className={`${className} rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 relative`}>
      <Image
        src={src}
        alt={name}
        fill
        sizes="(max-width: 768px) 40px, 80px"
        className="object-cover"
        onError={handleError}
        unoptimized={src.startsWith('http')} // Unoptimized for external URLs to avoid domain config issues
      />
    </div>
  );
}
