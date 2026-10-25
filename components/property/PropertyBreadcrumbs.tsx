import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PropertyBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function PropertyBreadcrumbs({ items }: PropertyBreadcrumbsProps) {
  return (
    <nav aria-label="パンくず" className="text-sm text-stone-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-sky-900 underline decoration-sky-200 underline-offset-4 hover:decoration-sky-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-stone-700" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
