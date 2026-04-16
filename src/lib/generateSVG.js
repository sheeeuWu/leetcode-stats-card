function getRingPath(cx, cy, r, startAngle, endAngle) {
  // Convert degrees to radians
  const start = ((startAngle - 90) * Math.PI) / 180;
  const end = ((endAngle - 90) * Math.PI) / 180;

  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);

  // Large arc flag — 1 if arc > 180 degrees
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

function buildRingSegments(easy, medium, hard, totalSolved, cx, cy, r, theme) {
  if (totalSolved === 0) {
    // Empty ring when no data
    return `
      <circle 
        cx="${cx}" cy="${cy}" r="${r}"
        fill="none"
        stroke="#${theme.subtext}33"
        stroke-width="6"
      />
    `;
  }

  const easyAngle = (easy / totalSolved) * 360;
  const mediumAngle = (medium / totalSolved) * 360;
  const hardAngle = (hard / totalSolved) * 360;

  const easyEnd = easyAngle;
  const mediumEnd = easyEnd + mediumAngle;
  const hardEnd = mediumEnd + hardAngle;

  const segments = [
    { color: theme.easy, start: 0, end: easyEnd },
    { color: theme.medium, start: easyEnd, end: mediumEnd },
    { color: theme.hard, start: mediumEnd, end: hardEnd },
  ];

  return segments
    .filter((s) => s.end - s.start > 0)
    .map(
      (s) => `
      <path
        d="${getRingPath(cx, cy, r, s.start, s.end)}"
        fill="none"
        stroke="#${s.color}"
        stroke-width="6"
        stroke-linecap="round"
      />
    `,
    )
    .join("");
}

function buildHideSet(hideParam) {
  if (!hideParam) return new Set();
  return new Set(hideParam.split(",").map((s) => s.trim().toLowerCase()));
}

export function generateSVG(stats, theme, params = {}) {
  const hide = buildHideSet(params.hide);
  const logo = params.logo ?? ''     //leetcode logo

  const {
    username,
    easy,
    medium,
    hard,
    totalSolved,
    platformRank,
    contestRating,
    globalRank,
    reputation,
    streak,
  } = stats;

  const LEGEND_START_Y = 80;
  const LEGEND_GAP = 24;
  const LEGEND_ITEMS = 3;

  // Card dimensions
  const WIDTH = 380;
  const PADDING = 24;
  const CX = PADDING + 40; // Ring center X
  // center of legend block(for aligning with circle)
  const CY = LEGEND_START_Y + ((LEGEND_ITEMS - 1) * LEGEND_GAP) / 2;
  const R = 35; // Ring radius

  const GAP = 16;
  const CARD_WIDTH = (WIDTH - PADDING * 2 - GAP) / 2;

  // Ring segments
  const ringSegments = buildRingSegments(
    easy,
    medium,
    hard,
    totalSolved,
    CX,
    CY,
    R,
    theme,
  );

  // Legend (right of ring)
  const legendSVG = [
    { key: "easy", label: "Easy", value: easy, color: theme.easy },
    { key: "medium", label: "Medium", value: medium, color: theme.medium },
    { key: "hard", label: "Hard", value: hard, color: theme.hard },
  ]
    .map(
      (row, i) => `
    <circle cx="${CX + R + 30}" cy="${LEGEND_START_Y + i * LEGEND_GAP}" r="4" fill="#${row.color}" />
    
    <text x="${CX + R + 30 + 12}" y="${LEGEND_START_Y + i * LEGEND_GAP + 4}"
      font-family="Inter, sans-serif"
      font-size="12"
      fill="#${theme.subtext}">
      ${row.label}
    </text>

    <text x="${WIDTH - PADDING}" y="${LEGEND_START_Y + i * LEGEND_GAP + 4}"
      font-family="Inter, sans-serif"
      font-size="12"
      font-weight="600"
      fill="#${theme.text}"
      text-anchor="end">
      ${row.value}
    </text>
  `,
    )
    .join("");

  // Grid (2x2 cards)
  const statCards = [
    { key: "platformrank", label: "PLATFORM RANK", value: platformRank },
    { key: "contestrating", label: "CONTEST RATING", value: contestRating },
    { key: "globalrank", label: "GLOBAL RANK", value: globalRank },
    { key: "reputation", label: "REPUTATION", value: reputation },
    { key: "streak", label: "STREAK", value: streak ? `${streak}d` : "—" },
    { key: "totalsolved", label: "TOTAL SOLVED", value: totalSolved },
  ].filter((c) => !hide.has(c.key));

  // Dynamic height based on visible rows
  const rows = Math.ceil(statCards.length / 2);
  const GRID_START_Y = CY + R + 30;
  const CARD_HEIGHT = GRID_START_Y + rows * 65 + PADDING;

  const gridSVG = statCards
    .map((card, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);

      const x = PADDING + col * (CARD_WIDTH + GAP);
      const y = GRID_START_Y + row * 65;

      return `
      <rect
        x="${x}"
        y="${y}"
        width="${CARD_WIDTH}"
        height="50"
        rx="10"
        fill="#${theme.subtext}11"
      />

      <text
        x="${x + 10}"
        y="${y + 18}"
        font-family="Inter, sans-serif"
        font-size="9"
        fill="#${theme.subtext}"
        letter-spacing="1"
      >
        ${card.label}
      </text>

      <text
        x="${x + 10}"
        y="${y + 36}"
        font-family="Inter, sans-serif"
        font-size="16"
        font-weight="600"
        fill="#${theme.accent}"
      >
        ${card.value ?? "—"}
      </text>
    `;
    })
    .join("");

  return `
<svg
  width="${WIDTH}"
  height="${CARD_HEIGHT}"
  viewBox="0 0 ${WIDTH} ${CARD_HEIGHT}"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
>
  <!-- Background -->
  <rect
    x="0.5"
    y="0.5"
    width="${WIDTH - 1}"
    height="${CARD_HEIGHT - 1}"
    rx="14"
    fill="#${theme.background}"
  />

  <!-- Header -->
  <image
    href="${logo}"
    x="${PADDING}"
    y="${PADDING}"
    width="28"
    height="28"
  />

  <text
    x="${PADDING + 36}"
    y="32"
    font-family="Inter, sans-serif"
    font-size="14"
    font-weight="600"
    fill="#${theme.text}"
  >
    LeetCode
  </text>

  <text
    x="${PADDING + 36}"
    y="46"
    font-family="Inter, sans-serif"
    font-size="11"
    fill="#${theme.subtext}"
  >
    @${username || "-"}
  </text>

  <!-- Ring background -->
  <circle
    cx="${CX}"
    cy="${CY}"
    r="${R}"
    fill="none"
    stroke="#${theme.subtext}33"
  />

  <!-- Ring segments -->
  ${ringSegments}

  <!-- Center text -->
  <text
    x="${CX}"
    y="${CY - 2}"
    text-anchor="middle"
    font-size="16"
    font-weight="600"
    fill="#${theme.accent}"
  >
    ${totalSolved}
  </text>

  <text
    x="${CX}"
    y="${CY + 12}"
    text-anchor="middle"
    font-size="9"
    fill="#${theme.subtext}"
  >
    SOLVED
  </text>

  <!-- Legend -->
  ${legendSVG}

  <!-- Grid -->
  ${gridSVG}

  <!-- View Profile -->
  <a href="https://leetcode.com/${username}" target="_blank">
    <text
      x="${PADDING}"
      y="${CARD_HEIGHT - PADDING - 2}"
      text-anchor="start"
      font-size="10"
      fill="#${theme.subtext}"
    >
      VIEW PROFILE ↗
    </text>
  </a>

</svg>
  `.trim();
}
