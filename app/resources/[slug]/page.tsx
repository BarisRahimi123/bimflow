"use client";

import { useParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function ResourceSlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  if (slug === 'tolerance') {
    return null;
  }

  redirect('/resources');
}
