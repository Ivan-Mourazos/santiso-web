import Link from "next/link";

export type CategoryTab = {
  href: string;
  label: string;
  meta?: string;
  active: boolean;
};

export function CategoryTabs({
  label,
  tabs,
}: {
  label: string;
  tabs: CategoryTab[];
}) {
  return (
    <nav className="category-tabs" aria-label={label}>
      {tabs.map((tab) => (
        <Link
          aria-current={tab.active ? "page" : undefined}
          className={tab.active ? "is-active" : undefined}
          href={tab.href}
          key={tab.href}
        >
          <span>{tab.label}</span>
          {tab.meta ? <small>{tab.meta}</small> : null}
        </Link>
      ))}
    </nav>
  );
}
