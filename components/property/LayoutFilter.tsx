"use client";

import { useRouter } from "next/navigation";
import { LAYOUT_GROUP_LABELS, type LayoutGroup } from "@/lib/property-routes";

type LayoutFilterProps = {
  buildingKind: "apartment" | "mansion";
  value: LayoutGroup | "all";
};

export function LayoutFilter({ buildingKind, value }: LayoutFilterProps) {
  const router = useRouter();

  return (
    <label className="flex flex-col gap-1 text-sm text-stone-600">
      間取り
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          const href =
            next === "all"
              ? `/rent/${buildingKind}`
              : `/rent/${buildingKind}/${next}`;
          router.push(href);
        }}
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-base text-stone-900"
      >
        <option value="all">すべて</option>
        {(Object.keys(LAYOUT_GROUP_LABELS) as LayoutGroup[]).map((group) => (
          <option key={group} value={group}>
            {LAYOUT_GROUP_LABELS[group]}
          </option>
        ))}
      </select>
    </label>
  );
}
