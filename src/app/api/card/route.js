import { fetchStats } from '@component/lib/fetchStats'
import { generateSVG } from '@component/lib/generateSVG'
import { getTheme } from '@component/lib/themes'


// Run on Vercel Edge Network — globally distributed, fastest response
export const runtime = 'edge'

// Validate username — only allow safe characters
function isValidUsername(username) {
  return /^[a-zA-Z0-9_-]{1,50}$/.test(username)
}

// Parse & validate all query params
function parseParams(searchParams) {
  return {
    username: searchParams.get('username')?.trim() ?? '',
    theme:    searchParams.get('theme')    ?? 'dark',
    hide:     searchParams.get('hide')     ?? '',

    // Custom color overrides — hex without #
    bg:     searchParams.get('bg')     ?? null,
    border: searchParams.get('border') ?? null,
    text:   searchParams.get('text')   ?? null,
    ring:   searchParams.get('ring')   ?? null,
    accent: searchParams.get('accent') ?? null,
  }
}

// Error card — returns a valid SVG even on failure
// So <img> tags never show a broken image
function errorSVG(message) {
  return `
<svg
  width="380" height="100"
  viewBox="0 0 380 100"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Error"
>
  <title>Error</title>
  <rect
    x="0.5" y="0.5"
    width="379" height="99"
    rx="12"
    fill="#161b22"
    stroke="#30363d"
    stroke-width="1"
  />
  <text
    x="24" y="44"
    font-family="'Segoe UI', Ubuntu, sans-serif"
    font-size="14"
    font-weight="600"
    fill="#ef4444"
  >Something went wrong</text>
  <text
    x="24" y="66"
    font-family="'Segoe UI', Ubuntu, sans-serif"
    font-size="12"
    fill="#8b949e"
  >${message}</text>
</svg>
  `.trim()
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const params = parseParams(searchParams)

  // Validate username before doing anything
  if (!params.username) {
    return new Response(
      errorSVG('Missing username. Use ?username=yourLeetCodeUsername'),
      {
        status: 400,
        headers: { 'Content-Type': 'image/svg+xml' },
      }
    )
  }

  if (!isValidUsername(params.username)) {
    return new Response(
      errorSVG('Invalid username. Only letters, numbers, hyphens and underscores allowed.'),
      {
        status: 400,
        headers: { 'Content-Type': 'image/svg+xml' },
      }
    )
  }

  try {
    // Fetch stats from LeetCode
    const stats = await fetchStats(params.username)
    
    // Build theme — base + any custom color overrides
    const theme = getTheme(params.theme, {
      bg:     params.bg,
      border: params.border,
      text:   params.text,
      ring:   params.ring,
      accent: params.accent,
    })

    // Generate SVG card
    const svg = generateSVG(stats, theme, {
      hide: params.hide,
    })

    return new Response(svg, {
      status: 200,
      headers: {
        // Tell browser this is an SVG image
        'Content-Type': 'image/svg+xml',

        // Layer 1 — Vercel Edge Cache
        // Fresh for 1 hour, serve stale for 24 hrs while revalidating in background
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',

        // Security headers
        'X-Content-Type-Options': 'nosniff',

        // Allow embedding as <img> from any domain
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    // Determine user-friendly error message
    const message = error.message === 'User not found'
      ? `User "${params.username}" not found on LeetCode`
      : 'Failed to fetch LeetCode stats. Please try again later.'

    return new Response(
      errorSVG(message),
      {
        status: error.message === 'User not found' ? 404 : 500,
        headers: {
          'Content-Type':                'image/svg+xml',
          'Cache-Control':               'no-store',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}