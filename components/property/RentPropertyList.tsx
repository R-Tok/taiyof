import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/properties";

type RentPropertyListProps = {
  properties: Property[];
};

const columns = [
  "写真",
  "物件名",
  "所在地",
  "間取",
  "賃料/月",
  "敷金",
  "礼金",
  "共益費",
  "駐車場",
  "築年数",
] as const;

function cell(value: string | undefined) {
  return value || "—";
}

export function RentPropertyList({ properties }: RentPropertyListProps) {
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
              {columns.map((label) => (
                <th key={label} className="px-4 py-3 font-medium whitespace-nowrap">
                  {label}
                </th>
              ))}
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
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  <Link
                    href={`/properties/${property.slug}`}
                    className="text-sky-900 underline decoration-sky-200 underline-offset-4 hover:decoration-sky-900"
                  >
                    {property.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{cell(property.address)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{cell(property.layout)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{cell(property.rentFee)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{cell(property.deposit)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{cell(property.gratuity)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{cell(property.commonFee)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{cell(property.parking)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{cell(property.builtYear)}</td>
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
                  {[property.layout, property.rentFee, property.builtYear]
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
