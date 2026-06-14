import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

export function BrandMark({ locale }: { locale: Locale }) {
  return (
    <Link className="brand" href={`/${locale}`} aria-label={siteConfig.name}>
      <span className="brand__crest">
        <Image
          src={siteConfig.crestUrl}
          alt=""
          width={56}
          height={56}
          priority
        />
      </span>
      <span className="brand__name">
        <strong>UD</strong>
        <span>Santiso</span>
      </span>
    </Link>
  );
}
