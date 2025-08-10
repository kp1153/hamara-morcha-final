import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";

// Google Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: path.join(process.cwd(), "json.json"), // आपकी JSON key फाइल का नाम
});

export async function GET(request) {
  try {
    // URL से slug (page path) लेना
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Google Analytics Data API से रिपोर्ट लेना
    const [response] = await analyticsDataClient.runReport({
      property: "properties/498352741", // आपका सही GA Property ID
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "EXACT", value: slug },
        },
      },
    });

    // Views निकालना
    const views = response.rows?.[0]?.metricValues?.[0]?.value || 0;

    // JSON रिस्पॉन्स भेजना
    return NextResponse.json({ views });
  } catch (error) {
    console.error("Error fetching views:", error);
    return NextResponse.json(
      { error: "Failed to fetch views" },
      { status: 500 }
    );
  }
}
