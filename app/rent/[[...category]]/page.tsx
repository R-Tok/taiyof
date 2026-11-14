import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LayoutFilter } from "@/components/property/LayoutFilter";
import { PropertyBreadcrumbs } from "@/components/property/PropertyBreadcrumbs";
import { RentPropertyList } from "@/components/property/RentPropertyList";
import { getPropertiesByCategoryKey } from "@/lib/properties";
import {
  getAllCategoryDefinitions,
  getCategoryBreadcrumbs,
  getRentHubCategories,
  RENT_HUB,
  resolveCategory,
} from "@/lib/property-routes";

type PageProps = {
  params: Promise<{ category?: string[] }>;
};

export function generateStaticParams() {
  const categories = getAllCategoryDefinitions().filter(
    (category) => category.transactionType === "rent",
  );

  return [{}, ...categories.map((category) => ({ category: category.segments }))];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const definition = resolveCategory("rent", category);

  if (!definition) {
    if (!category?.length) {
      return {
        title: "賃貸物件",
        description:
          "上越市の賃貸物件。アパート、マンション、戸建住宅、店舗・倉庫をご案内します。",
      };
    }
    return { title: "賃貸物件" };
  }

  return {
    title: definition.title,
    description: `${definition.title}の賃貸物件一覧です。`,
  };
}

function RentHub() {
  const categories = getRentHubCategories();

  return (
    <>
      <p className="mt-4 leading-8 text-stone-700">{RENT_HUB.intro}</p>
      <p className="mt-2 text-sm text-stone-500">{RENT_HUB.note}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.key}
            href={category.href}
            className="group flex min-h-[140px] flex-col justify-between rounded-xl border border-stone-200 bg-stone-50 p-6 transition-colors hover:border-sky-300 hover:bg-sky-50/50"
          >
            <div>
              <p className="text-lg font-semibold text-stone-900 group-hover:text-sky-900">
                {category.hubLabel}
              </p>
              {category.description ? (
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {category.description}
                </p>
              ) : null}
            </div>
            <span className="mt-4 text-sm font-medium text-sky-900">
              物件一覧を見る →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export default async function RentPage({ params }: PageProps) {
  const { category } = await params;

  if (!category?.length) {
    return (
      <main className="flex flex-1 flex-col bg-white text-stone-900">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-sm font-medium tracking-wide text-sky-900">
            太陽不動産株式会社
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {RENT_HUB.title}
          </h1>
          <RentHub />
        </div>
      </main>
    );
  }

  const definition = resolveCategory("rent", category);

  if (!definition?.rent) {
    notFound();
  }

  const properties = await getPropertiesByCategoryKey(definition.key);
  const breadcrumbs = getCategoryBreadcrumbs(definition);
  const buildingKind = definition.rent.buildingKind;
  const heading =
    resolveCategory("rent", [buildingKind])?.title ?? definition.title;

  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <PropertyBreadcrumbs items={breadcrumbs} />
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {heading}
            </h1>
            {definition.description ? (
              <p className="mt-3 text-stone-600">{definition.description}</p>
            ) : null}
          </div>
          {buildingKind === "apartment" || buildingKind === "mansion" ? (
            <LayoutFilter
              buildingKind={buildingKind}
              value={definition.rent.layoutGroup ?? "all"}
            />
          ) : null}
        </div>

        <RentPropertyList properties={properties} />
      </div>
    </main>
  );
}
