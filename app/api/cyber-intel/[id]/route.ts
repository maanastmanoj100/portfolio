import { NextResponse } from "next/server";
import { getRepository } from "@/lib/cyber-intel/storage";

/**
 * Single record plus a small set of related records (same country or shared
 * identifiers). Used by the detail panel and by anything that needs a stable
 * permalink for one archived item.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_STORE = {
  "cache-control": "no-store, max-age=0",
};

const ID_PATTERN = /^ci-[a-z0-9]{1,24}$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!ID_PATTERN.test(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400, headers: NO_STORE });
  }

  try {
    const repository = await getRepository();
    const item = await repository.getItem(id);
    if (!item) {
      return NextResponse.json({ error: "not_found" }, { status: 404, headers: NO_STORE });
    }

    const related = await repository.relatedItems(item, 5);
    return NextResponse.json({ item, related }, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "archive_unavailable" },
      { status: 503, headers: NO_STORE },
    );
  }
}
