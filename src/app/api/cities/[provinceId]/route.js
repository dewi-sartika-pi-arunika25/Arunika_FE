// src/app/api/cities/[provinceId]/route.js
export async function GET(request, { params }) {
  const { provinceId } = params;
  try {
    const res = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
    if (!res.ok) throw new Error("Gagal fetch dari API emsifa");
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error di API /api/cities:", error);
    return new Response(JSON.stringify({ message: "Gagal fetch data cities" }), { status: 500 });
  }
}
