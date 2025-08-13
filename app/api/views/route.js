import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

export const dynamic = "force-dynamic"; // Next 13/14/15: SSR, no static cache
export const revalidate = 0; // कोई कैश नहीं

// GA credentials env var से (Vercel → Settings → Environment Variables)
const credentialsJson = process.env.GA_CREDENTIALS;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: credentialsJson ? JSON.parse(credentialsJson) : undefined,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug"); // e.g. "/jeevan-ke-rang/20250813235240261"

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // पहले EXACT ट्राई करेंगे: अगर पूरा path आया है तो तुरंत मिलेगा
    const exactReq = {
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
    };

    let [resp] = await analyticsDataClient.runReport(exactReq);
    let views = Number(resp.rows?.[0]?.metricValues?.[0]?.value || 0);

    // अगर EXACT से 0 आया, तो PARTIAL ट्राई करो (कहीं तुमने सिर्फ slug का अंतिम हिस्सा भेजा हो)
    if (!views) {
      const partialReq = {
        ...exactReq,
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: { matchType: "PARTIAL", value: slug },
          },
        },
      };
      [resp] = await analyticsDataClient.runReport(partialReq);
      views = Number(resp.rows?.[0]?.metricValues?.[0]?.value || 0);
    }

    return NextResponse.json({ views });
  } catch (error) {
    console.error("Error fetching views:", error);
    return NextResponse.json(
      { error: "Failed to fetch views" },
      { status: 500 }
    );
  }
}
