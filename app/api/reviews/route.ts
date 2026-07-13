import { NextResponse } from "next/server";

// PLACE_ID: reemplazá con el Place ID real de Frecuencia Sur Ushuaia en Google
// Encontralo en: https://developers.google.com/maps/documentation/places/web-service/place-id
// API KEY: configurá GOOGLE_PLACES_API_KEY en .env.local

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId || apiKey === "TU_API_KEY_AQUI" || placeId === "TU_PLACE_ID_AQUI") {
    return NextResponse.json({ reviews: [] }, { status: 200 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=es`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json({ reviews: [] }, { status: 200 });
    }

    const data = await res.json();

    if (data.status !== "OK" || !data.result?.reviews) {
      return NextResponse.json({ reviews: [] }, { status: 200 });
    }

    return NextResponse.json({
      reviews: data.result.reviews,
      rating: data.result.rating,
      totalReviews: data.result.user_ratings_total,
    });
  } catch {
    return NextResponse.json({ reviews: [] }, { status: 200 });
  }
}
