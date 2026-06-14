export function DataEmpty({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="empty-panel">
      <span>+</span>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
