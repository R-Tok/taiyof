"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";

export function ContactFormWithSearchParams() {
  const searchParams = useSearchParams();
  const propertyName = searchParams.get("param") ?? "";

  return <ContactForm defaultPropertyName={propertyName} />;
}
