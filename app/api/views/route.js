import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: JSON.parse(process.env.GA_CREDENTIALS),
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug"); // example: "/category/post-slug"

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const resp = await analyticsDataClient.runReport({
      property: "properties/498352741",
      dateRanges: [{ startDate: "today", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: slug },
        },
      },
    });

    const views = Number(resp.rows?.[0]?.metricValues?.[0]?.value || 0);
    return NextResponse.json({ views });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch views" },
      { status: 500 }
    );
  }
}
