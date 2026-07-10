import type { LucideIcon } from "lucide-react";

type IconFeatureProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
};

export function IconFeature({ icon: Icon, title, subtitle, className = "" }: IconFeatureProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zencarta-green/10 text-zencarta-green transition-colors group-hover:bg-zencarta-green group-hover:text-white">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-zencarta-navy dark:text-slate-100">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-xs leading-snug text-zencarta-muted">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
