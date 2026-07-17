const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "public", "images");
fs.mkdirSync(DIR, { recursive: true });

const palettes = [
  ["#ffd9c2", "#ff8fa3", "#ffd93d"],
  ["#ffe9c7", "#ffb3a7", "#ff6b6b"],
  ["#cfe3c0", "#9caf88", "#ffd93d"],
  ["#ffd6e0", "#ff8fa3", "#ffefb8"],
  ["#f6d8c4", "#ff9e7d", "#ffd93d"],
  ["#e7d6f5", "#ff8fa3", "#ffd93d"],
  ["#d8ecf0", "#9caf88", "#ffd9c2"],
  ["#ffe0c2", "#ff6b6b", "#ffd93d"],
];

function svg(label, idx, w = 800, h = 1000) {
  const [a, b, c] = palettes[idx % palettes.length];
  const gid = `g${idx}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="55%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="r${idx}" cx="30%" cy="25%" r="80%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${gid})"/>
  <rect width="${w}" height="${h}" fill="url(#r${idx})"/>
  <circle cx="${w * 0.78}" cy="${h * 0.2}" r="${w * 0.18}" fill="#ffffff" opacity="0.18"/>
  <circle cx="${w * 0.2}" cy="${h * 0.82}" r="${w * 0.14}" fill="#1a1a1a" opacity="0.06"/>
  <text x="50%" y="52%" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(w / 14)}" fill="#1a1a1a" opacity="0.22" font-style="italic">${label}</text>
</svg>`;
}

const files = [
  ["hero.svg", "Manju KC", 0],
  ["about.svg", "Behind the Strategy", 1],
  ["about-1.svg", "Golden Hour", 2],
  ["about-2.svg", "In the Kitchen", 3],
  ["about-3.svg", "Letters", 4],
  ["work-1.svg", "Lumen", 5],
  ["work-2.svg", "Brews", 6],
  ["work-3.svg", "Wanderwell", 7],
  ["blog-1.svg", "Friends", 0],
  ["blog-2.svg", "Quiet", 2],
  ["blog-3.svg", "Reels", 4],
  ["avatar-1.svg", "Aria", 1],
  ["avatar-2.svg", "Ravi", 3],
  ["avatar-3.svg", "Mei", 5],
];

for (const [name, label, idx] of files) {
  const isAvatar = name.startsWith("avatar");
  const content = svg(label, idx, isAvatar ? 400 : 800, isAvatar ? 400 : 1000);
  fs.writeFileSync(path.join(DIR, name), content);
}

console.log("Generated", files.length, "placeholder images");
