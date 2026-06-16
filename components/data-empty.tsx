export function DataEmpty({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="empty-panel">
      <svg
        className="empty-panel__icon"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ margin: "0 auto 24px", color: "var(--gold)", opacity: 0.85 }}
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M5 11h14" />
        <circle cx="12" cy="11" r="3" />
        <path d="M12 2v20" />
      </svg>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
