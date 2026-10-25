import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/properties";

type DealPropertyListProps = {
  properties: Property[];
};

export function DealPropertyList({ properties }: DealPropertyListProps) {
  if (properties.length === 0) {
    return (
      <p className="mt-8 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-10 text-center text-stone-600">
        現在、掲載中の物件はありません。
      </p>
    );
  }

  return (
    <>
      <div className="mt-8 hidden overflow-x-auto rounded-lg border border-stone-200 md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">外観</th>
              <th className="px-4 py-3 font-medium">物件名</th>
              <th className="px-4 py-3 font-medium">所在地</th>
              <th className="px-4 py-3 font-medium">間取</th>
              <th className="px-4 py-3 font-medium">価格</th>
              <th className="px-4 py-3 font-medium">土地面積</th>
              <th className="px-4 py-3 font-medium">専有面積</th>
              <th className="px-4 py-3 font-medium">築年数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {properties.map((property) => (
              <tr key={property.slug} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  {property.thumbnail ? (
                    <Link href={`/properties/${property.slug}`} className="block">
                      <Image
                        src={property.thumbnail.src}
                        alt={property.thumbnail.alt}
                        width={88}
                        height={66}
                        className="h-[66px] w-[88px] rounded object-cover"
                      />
                    </Link>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/properties/${property.slug}`}
                    className="text-sky-900 underline decoration-sky-200 underline-offset-4 hover:decoration-sky-900"
                  >
                    {property.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{property.address}</td>
                <td className="px-4 py-3">{property.layout ?? "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{property.price}</td>
                <td className="px-4 py-3">{property.landArea ?? "—"}</td>
                <td className="px-4 py-3">{property.buildingArea ?? "—"}</td>
                <td className="px-4 py-3">{property.builtYear ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-8 space-y-4 md:hidden">
        {properties.map((property) => (
          <li key={property.slug}>
            <Link
              href={`/properties/${property.slug}`}
              className="flex gap-4 rounded-lg border border-stone-200 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/40"
            >
              {property.thumbnail ? (
                <Image
                  src={property.thumbnail.src}
                  alt={property.thumbnail.alt}
                  width={88}
                  height={66}
                  className="h-[66px] w-[88px] shrink-0 rounded object-cover"
                />
              ) : null}
              <div className="min-w-0 space-y-1">
                <p className="font-medium text-stone-900">{property.name}</p>
                <p className="text-sm text-stone-600">{property.address}</p>
                <p className="text-sm text-stone-600">
                  {[property.layout, property.price, property.builtYear]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
