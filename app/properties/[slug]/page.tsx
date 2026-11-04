import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyBreadcrumbs } from "@/components/property/PropertyBreadcrumbs";
import { buildPropertyInquiryHref } from "@/lib/contact";
import {
  getDetailFields,
  getPropertyBySlug,
  getPropertySlugs,
} from "@/lib/properties";
import {
  getAllCategoryDefinitions,
  getCategoryBreadcrumbs,
} from "@/lib/property-routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getCategoryForProperty(categoryKey: string) {
  return getAllCategoryDefinitions().find((c) => c.key === categoryKey);
}

export async function generateStaticParams() {
  const slugs = await getPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "物件が見つかりません" };
  }

  return {
    title: property.name,
    description: `${property.address ?? ""} ${property.price ?? ""}`.trim(),
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const category = getCategoryForProperty(property.categoryKey);
  if (!category) {
    notFound();
  }

  const detailFields = getDetailFields(property);
  const images = property.images.length
    ? property.images
    : property.thumbnail
      ? [property.thumbnail]
      : [];

  const breadcrumbs = [
    ...getCategoryBreadcrumbs(category),
    { label: property.name },
  ];

  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <PropertyBreadcrumbs items={breadcrumbs} />

        <header className="mt-4 border-b border-stone-200 pb-6">
          <p className="text-sm font-medium text-sky-900">
            {category.transactionType === "deal" ? "売買物件" : "賃貸物件"}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {property.name}
          </h1>
          {property.price ? (
            <p className="mt-2 text-lg text-stone-700">{property.price}</p>
          ) : null}
        </header>

        {images.length > 0 ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <li
                key={image.src}
                className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </li>
            ))}
          </ul>
        ) : null}

        <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
          {detailFields.map((field) => (
            <div
              key={field.label}
              className="grid gap-1 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6 sm:py-5"
            >
              <dt className="text-sm font-medium text-stone-500">{field.label}</dt>
              <dd
                className={`text-base leading-7 ${field.preWrap ? "whitespace-pre-wrap" : ""}`}
              >
                {field.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={category.href}
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 px-5 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50"
          >
            {category.title}一覧へ戻る
          </Link>
          <Link
            href={buildPropertyInquiryHref(property.name)}
            className="inline-flex items-center justify-center rounded-lg bg-sky-900 px-5 py-3 text-sm font-medium text-white hover:bg-sky-950"
          >
            この物件を問い合わせる
          </Link>
        </div>
      </article>
    </main>
  );
}
