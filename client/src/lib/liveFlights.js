const PROXY_BASES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://r.jina.ai/http://',
];

export async function fetchOpenSkyStates({ lamin, lomin, lamax, lomax }) {
  const openSkyUrl = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
  const attempts = [];

  for (const base of PROXY_BASES) {
    try {
      const url = base.includes('jina.ai')
        ? `${base}${openSkyUrl.replace('https://', '')}`
        : `${base}${encodeURIComponent(openSkyUrl)}`;

      const res = await fetch(url);
      if (!res.ok) {
        attempts.push(`${base} -> ${res.status}`);
        continue;
      }

      const payload = await res.json();
      return payload;
    } catch (err) {
      attempts.push(`${base} -> network error`);
    }
  }

  throw new Error(`Live tracker temporarily unavailable (${attempts.join(', ')})`);
}
