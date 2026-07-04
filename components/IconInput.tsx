import * as React from "react";
import { type LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Single-line `<Input>` or multi-line `<Textarea>` prefixed by a Lucide icon.
 *
 * Replaces the duplicated `<div className="relative"><Icon/><Input pl-9/></div>`
 * markup that appeared in `app/dashboard/new/page.tsx` and
 * `components/SettingsForm.tsx`. The icon sits absolute-left at the
 * geometrically-correct vertical anchor (`top-1/2 -translate-y-1/2` for a
 * one-line Input, `top-3` for a Textarea). Inputs are padded with `pl-9` so
 * placeholder/value text starts after the icon.
 *
 * The `key` prop is forwarded to the underlying Input/Textarea, which is what
 * Conform's `fields.X.key` (used to remount on form identity change) needs —
 * spread-forwarding keeps that behavior identical to the inline markup this
 * component replaces.
 *
 * @example
 *   <IconInput icon={User} name={field.name} key={field.key} defaultValue={...} />
 * @example
 *   <IconInput as="textarea" icon={FileText} name={...} placeholder="..." />
 */
interface IconInputProps extends React.ComponentProps<typeof Input> {
  icon: LucideIcon;
  as?: "input" | "textarea";
}

export function IconInput({
  icon: Icon,
  as = "input",
  className,
  ...rest
}: IconInputProps) {
  const iconClassName =
    as === "textarea"
      ? "absolute left-3 top-3 size-4 text-muted-foreground"
      : "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground";

  if (as === "textarea") {
    return (
      <div className="relative">
        <Icon className={iconClassName} />
        <Textarea
          {...(rest as React.ComponentProps<typeof Textarea>)}
          className={cn("pl-9 min-h-20 resize-none", className)}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <Icon className={iconClassName} />
      <Input className={cn("pl-9", className)} {...rest} />
    </div>
  );
}
