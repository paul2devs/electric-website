import Image from "next/image";

import { DEFAULT_SERVICE_IMAGE } from "@/lib/services/service-media";
import { cn } from "@/lib/utils";

type ServiceImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function ServiceImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "160px",
  priority = false,
}: ServiceImageProps) {
  const resolved = src?.trim() || DEFAULT_SERVICE_IMAGE;

  return (
    <div className={cn("relative overflow-hidden bg-hover", className)}>
      <Image
        src={resolved}
        alt={alt}
        fill
        className={cn("object-cover", imageClassName)}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
