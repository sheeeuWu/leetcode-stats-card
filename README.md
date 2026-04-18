# leetcode-stats-card

Generate a beautiful, customizable LeetCode stats card for your GitHub README or portfolio — just like GitHub Readme Stats, but for LeetCode!

![demo](./public/preview-dark.png)

## 🚀 Usage

Add this to your GitHub README or any markdown file:

\`\`\`md
[![LeetCode Stats](https://leetcode-stats-card-opal.vercel.app/api/card?username=YOUR_USERNAME)](https://leetcode.com/YOUR_USERNAME)
\`\`\`

Or use it as an `<img>` tag in your portfolio:

\`\`\`html
<img src="https://leetcode-stats-card-opal.vercel.app/api/card?username=YOUR_USERNAME" alt="LeetCode Stats" />
\`\`\`

---

## 🎨 Themes

### Dark (default)
![dark theme](./public/preview-dark.png)

### Light
![light theme](./public/preview-light.png)

### Transparent
![transparent theme](./public/preview-transparent.png)

\`\`\`md
[![LeetCode Stats](https://leetcode-stats-card-opal.vercel.app/api/card?username=YOUR_USERNAME&theme=dark)](https://leetcode.com/YOUR_USERNAME)
[![LeetCode Stats](https://leetcode-stats-card-opal.vercel.app/api/card?username=YOUR_USERNAME&theme=light)](https://leetcode.com/YOUR_USERNAME)
[![LeetCode Stats](https://leetcode-stats-card-opal.vercel.app/api/card?username=YOUR_USERNAME&theme=transparent)](https://leetcode.com/YOUR_USERNAME)
\`\`\`

---

## ⚙️ Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `username` | string | required | Your LeetCode username |
| `theme` | string | `dark` | Card theme: `dark`, `light`, `transparent` |
| `hide` | string | — | Hide specific stats, comma separated |
| `bg` | hex | — | Custom background color (without `#`) |
| `accent` | hex | — | Custom accent/value color (without `#`) |

---

## 📊 Stats Grid

You can choose which stats to display in the 2×2 grid using the `hide` parameter.

Available stats:

| Key | Description |
|---|---|
| `platformrank` | Your global LeetCode platform rank |
| `contestrating` | Your contest rating |
| `globalrank` | Your global contest rank |
| `reputation` | Your reputation points |
| `streak` | Your current streak |
| `totalsolved` | Total problems solved |

**Example — show only Platform Rank and Total Solved:**
\`\`\`md
![LeetCode Stats](https://leetcode-stats-card-opal.vercel.app/api/card?username=YOUR_USERNAME&hide=contestrating,globalrank,reputation,streak)
\`\`\`

---

## 🎨 Custom Colors

You can fully customize the card colors using hex values (without `#`):

\`\`\`md
![LeetCode Stats](https://leetcode-stats-card-opal.vercel.app/api/card?username=YOUR_USERNAME&bg=1a1a2e&accent=e94560)
\`\`\`

---

## 🌐 Live Demo

Try the interactive card generator at:
**[leetcode-stats-card-opal.vercel.app](https://leetcode-stats-card-opal.vercel.app)**

![demo page](./public/preview-demo.png)

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) — framework
- [Vercel](https://vercel.com/) — hosting & edge functions
- LeetCode GraphQL API — data source
- Pure SVG — zero dependencies for card generation

---

## 🏃 Running Locally

```bash
git clone https://github.com/sheeeuWu/leetcode-stats-card.git
cd leetcode-stats-card
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo page.

The API will be available at:

```
http://localhost:3000/api/card?username=YOUR_USERNAME
```

---

## 📝 License

MIT © [saifaliCodes](https://github.com/sheeeuWu)
\`\`\`

---

