import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DealPropertyList } from "@/components/property/DealPropertyList";
import { PropertyBreadcrumbs } from "@/components/property/PropertyBreadcrumbs";
import { getPropertiesByCategoryKey } from "@/lib/properties";
import {
  DEAL_HUB,
  getCategoryBreadcrumbs,
  getDealHubCategories,
  resolveCategory,
} from "@/lib/property-routes";

type PageProps = {
  params: Promise<{ category?: string[] }>;
};

export function generateStaticParams() {
  return [
    {},
    { category: ["land"] },
    { category: ["house-mansion"] },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const definition = resolveCategory("deal", category);

  if (!definition) {
    if (!category?.length) {
      return {
        title: "売買物件",
        description:
          "上越市の売買物件。土地、戸建・マンションなどの情報をご案内します。",
      };
    }
    return { title: "売買物件" };
  }

  return {
    title: definition.title,
    description: `${definition.title}の売買物件一覧です。`,
  };
}

function DealHub() {
  const categories = getDealHubCategories();

  return (
    <>
      <p className="mt-4 leading-8 text-stone-700">{DEAL_HUB.intro}</p>
      <p className="mt-2 text-sm text-stone-500">{DEAL_HUB.note}</p>

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

export default async function DealPage({ params }: PageProps) {
  const { category } = await params;

  if (!category?.length) {
    return (
      <main className="flex flex-1 flex-col bg-white text-stone-900">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
          <p className="text-sm font-medium tracking-wide text-sky-900">
            太陽不動産株式会社
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {DEAL_HUB.title}
          </h1>
          <DealHub />
        </div>
      </main>
    );
  }

  const definition = resolveCategory("deal", category);

  if (!definition) {
    notFound();
  }

  const properties = await getPropertiesByCategoryKey(definition.key);
  const breadcrumbs = getCategoryBreadcrumbs(definition);

  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <PropertyBreadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          {definition.title}
        </h1>
        {definition.description ? (
          <p className="mt-3 text-stone-600">{definition.description}</p>
        ) : null}

        <DealPropertyList
          properties={properties}
          kind={definition.deal?.kind ?? "house-mansion"}
        />
      </div>
    </main>
  );
}
