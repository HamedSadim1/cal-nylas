import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Display a user avatar as either the given `imageUrl` (rendered through
 * `next/image`) or a single-letter monogram in a primary-color circle when no
 * image is available.
 *
 * Default dimensions match the booking-page convention that this component
 * replaces: a `size-9` (36px) box scaled from a `30`px source — Next/Image
 * generates a 1x/2x srcset from `width/height` and the Tailwind `size-9`
 * class stretches the display box.
 *
 * @example
 *   <UserAvatar name={user.name} imageUrl={user.image} />
 * @example Custom size (e.g. settings page preview):
 *   <UserAvatar name={...} imageUrl={...} size={80} className="size-20 rounded-xl" />
 */
interface UserAvatarProps {
  name: string | null | undefined;
  imageUrl: string | null | undefined;
  /** Pixel size used for the `<Image>` source-set (defaults to 30). */
  size?: number;
  /** Tailwind classes for the rendered box (defaults to `"size-9"`). */
  className?: string;
}

export function UserAvatar({
  name,
  imageUrl,
  size = 30,
  className = "size-9",
}: UserAvatarProps) {
  const alt = `${name ?? "User"}'s profile picture`;

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        width={size}
        height={size}
        className={cn("rounded-full", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 flex items-center justify-center",
        className,
      )}
      // Inline width/height drives the box when callers override className
      // (e.g. `size-20`); CSS `width/height: <size>px` keeps the monogram
      // round when the caller drops a `rounded-*` utility but no size class.
      style={{ width: size, height: size }}
    >
      <span className="text-xs font-medium text-primary">
        {(name || "?").charAt(0)}
      </span>
    </div>
  );
}
