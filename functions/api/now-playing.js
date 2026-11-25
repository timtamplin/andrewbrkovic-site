// Cloudflare Pages Function — GET /api/now-playing
// Holds the Spotify credentials; the browser never sees them.

let cachedToken = null;
let cachedExpiry = 0;

async function getAccessToken(env) {
  const now = Date.now();
  if (cachedToken && now < cachedExpiry) return cachedToken;

  const basic = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!res.ok) throw new Error(`token exchange ${res.status}`);

  const data = await res.json();
  cachedToken = data.access_token;
  cachedExpiry = now + Math.max(0, (data.expires_in ?? 3600) - 60) * 1000;
  return cachedToken;
}

export async function onRequestGet({ env }) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=20, s-maxage=20",
  };

  const off = () => new Response(JSON.stringify({ playing: false }), { headers });

  try {
    const token = await getAccessToken(env);
    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 204 = nothing playing. Anything else unexpected = stay silent.
    if (res.status !== 200) return off();
    const j = await res.json();

    // Deliberately disclose nothing unless audio is actually playing:
    // no "last played", no paused track, no device names.
    if (!j || !j.is_playing || !j.item) return off();

    const item = j.item;
    return new Response(
      JSON.stringify({
        playing: true,
        title: item.name,
        artist: (item.artists || []).map((a) => a.name).join(", "),
        album: item.album?.name ?? "",
        art: item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url ?? "",
        url: item.external_urls?.spotify ?? "",
        progress: j.progress_ms ?? 0,
        duration: item.duration_ms ?? 0,
      }),
      { headers }
    );
  } catch {
    return off();
  }
}
