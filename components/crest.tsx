import Image from "next/image";

export function Crest({
  src,
  name,
  size = 54,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  if (!src) {
    return (
      <span className="crest-placeholder" style={{ width: size, height: size }}>
        {name.slice(0, 1)}
      </span>
    );
  }

  return (
    <Image
      className="team-crest"
      src={src}
      alt=""
      width={size}
      height={size}
    />
  );
}
