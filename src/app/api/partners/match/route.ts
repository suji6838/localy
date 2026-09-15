import { NextResponse } from "next/server";
import { matchPartners } from "@/lib/matching";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceType = searchParams.get("serviceType")?.trim() ?? "";
  const neighborhood = searchParams.get("neighborhood")?.trim() ?? "";

  if (!serviceType || !neighborhood) {
    return NextResponse.json({ error: "서비스와 지역을 선택해 주세요." }, { status: 400 });
  }

  const matches = await matchPartners(serviceType, neighborhood);
  return NextResponse.json({ matches });
}
