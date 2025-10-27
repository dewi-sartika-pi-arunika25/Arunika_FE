// API route untuk proxy data provinsi
export async function GET() {
  try {
    const res = await fetch("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json");
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Gagal fetch data provinces" }), {
      status: 500,
    });
  }
}
