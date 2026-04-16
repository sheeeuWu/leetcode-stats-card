"use client";
import { useState } from "react";
import clsx from "clsx";

const THEME_OPTIONS = ["dark", "light", "transparent"];

const STAT_OPTIONS = [
  { key: "platformRank", label: "Platform Rank" },
  { key: "contestRating", label: "Contest Rating" },
  { key: "globalRank", label: "Global Rank" },
  { key: "reputation", label: "Reputation" },
  { key: "streak", label: "Streak" },
  { key: "totalSolved", label: "Total Solved" },
];

// Pair stats into rows of 2
function pairStats(selected) {
  const pairs = [];
  for (let i = 0; i < selected.length; i += 2) {
    pairs.push(selected.slice(i, i + 2));
  }
  return pairs;
}

export default function PreviewCard() {
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("dark");
  const [selectedStats, setSelectedStats] = useState([
    "platformRank",
    "totalSolved",
  ]);
  const [bg, setBg] = useState("");
  const [accent, setAccent] = useState("");
  const [cardUrl, setCardUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  function toggleStat(key) {
    setSelectedStats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function buildUrl(uname) {
    const base = window.location.origin;
    const params = new URLSearchParams({ username: uname, theme });

    // hide stats that are NOT selected
    const allKeys = STAT_OPTIONS.map((s) => s.key);
    const hidden = allKeys.filter((k) => !selectedStats.includes(k));
    if (hidden.length) params.set("hide", hidden.join(","));

    if (bg) params.set("bg", bg.replace("#", ""));
    if (accent) params.set("accent", accent.replace("#", ""));

    return `${base}/api/card?${params.toString()}`;
  }

  function handleGenerate() {
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter a username");
      return;
    }
    if (!/^[a-zA-Z0-9_-]{1,50}$/.test(trimmed)) {
      setError("Invalid username — only letters, numbers, - and _ allowed");
      return;
    }
    setError("");
    setLoading(true);
    setCardUrl(buildUrl(trimmed));
    setUsername("");
    setTheme("dark");
    setSelectedStats(["platformRank", "totalSolved"]);
  }

  function copyUrl() {
    if (!cardUrl) return;
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copyMarkdown() {
    if (!cardUrl) return;
    const md = `[![LeetCode Stats](${cardUrl})](https://leetcode.com/${username.trim()})`;
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  }

  // console.log("selectedStats:", selectedStats);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      {/* Username */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/60">LeetCode Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="e.g. john_doe"
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 outline-none focus:border-[#fefe5b]/50 transition-colors text-sm"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* Theme */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/60">Theme</label>
        <div className="flex gap-2 flex-wrap">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-lg text-sm border transition-all capitalize
                ${
                  theme === t
                    ? "border-[#fefe5b] text-[#fefe5b] bg-[#fefe5b]/10"
                    : "border-white/10 text-white/50 hover:border-white/30"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/60">
          Stats to Show
          <span className="text-white/30 ml-2 text-xs">
            displayed in pairs of 2
          </span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {STAT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleStat(key)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all
                ${
                  selectedStats.includes(key)
                    ? "border-[#fefe5b]/50 text-[#fefe5b] bg-[#fefe5b]/10"
                    : "border-white/10 text-white/50 hover:border-white/30"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Preview of pairs */}
        {selectedStats.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {pairStats(selectedStats).map((pair, i) => (
              <div key={i} className="flex gap-2 text-xs text-white/30">
                <span>Row {i + 1}:</span>
                {pair.map((k) => (
                  <span key={k} className="text-white/50">
                    {STAT_OPTIONS.find((s) => s.key === k)?.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom colors */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-white/60">
          Custom Colors
          <span className="text-white/30 ml-2 text-xs">optional</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Background", value: bg, setter: setBg },
            { label: "Accent", value: accent, setter: setAccent },
          ].map(({ label, value, setter }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-xs text-white/40">{label}</span>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                <input
                  type="color"
                  value={value || "#000000"}
                  onChange={(e) => setter(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder="e.g. 1a1a2e"
                  className="bg-transparent text-white/70 text-xs outline-none w-full placeholder:text-white/20"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        className={clsx(
          "w-full py-3 rounded-lg bg-[#fefe5b] text-black",
          "font-medium text-sm hover:bg-[#fefe5b]/90",
          "active:scale-[0.98] transition-all",
        )}
      >
        Generate Card
      </button>

      {/* Live preview */}
      {cardUrl && (
        <div className="flex flex-col gap-3">
          {/* Card */}
          <div className="flex flex-col gap-4 w-full text-white p-2">
            {/* SVG card from API */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={cardUrl}
              src={cardUrl}
              alt="LeetCode Stats Card"
              className="w-full h-auto"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError("Could not load card. Check the username.");
              }}
            />
          </div>
        </div>
      )}

      {/* Copy buttons */}
      {cardUrl && (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={copyUrl}
            className={clsx(
              "flex-1 px-4 py-3 text-sm rounded-lg transition-all",
              "border border-white/10 text-white/60",
              "hover:text-[#fefe5b] hover:bg-[#fefe5b]/10 hover:border-[#fefe5b]/30",
            )}
          >
            {copied ? "✓ Copied!" : "Copy URL"}
          </button>
          <button
            onClick={copyMarkdown}
            className={clsx(
              "flex-1 px-4 py-3 text-sm rounded-lg transition-all",
              "border border-white/10 text-white/60",
              "hover:text-[#fefe5b] hover:bg-[#fefe5b]/10 hover:border-[#fefe5b]/30",
            )}
          >
            {copiedMarkdown ? "✓ Copied Markdown!" : "Copy Markdown"}
          </button>
        </div>
      )}

      {/* Generated URL */}
      {cardUrl && (
        <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <p className="text-xs text-white/30 mb-1">Generated URL</p>
          <p className="text-xs text-white/60 break-all font-mono">{cardUrl}</p>
        </div>
      )}
    </div>
  );
}
