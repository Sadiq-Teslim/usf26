import Link from "next/link";
import { SportForm } from "@/components/admin/sport-form";
import { createSport } from "../actions";

export default function NewSportPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/sports" className="text-sm text-muted hover:text-foreground">
          &larr; Sports
        </Link>
        <h1 className="font-display text-2xl">New sport</h1>
      </div>
      <SportForm action={createSport} submitLabel="Create sport" />
    </div>
  );
}
