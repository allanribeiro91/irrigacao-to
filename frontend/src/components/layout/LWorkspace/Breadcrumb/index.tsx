import "./index.css";

interface BreadcrumbProps {
  title: string;
}

export function Breadcrumb({ title }: BreadcrumbProps) {
  const parts = title
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <nav className="l-breadcrumb" aria-label="Localização da página">
      <ol className="l-breadcrumb__list">
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;

          return (
            <li key={`${index}-${part}`} className="l-breadcrumb__item">
              {index > 0 && (
                <span className="l-breadcrumb__separator" aria-hidden="true">
                  /
                </span>
              )}

              <span
                className={
                  isLast ? "l-breadcrumb__current" : "l-breadcrumb__parent"
                }
                aria-current={isLast ? "page" : undefined}
              >
                {part}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
