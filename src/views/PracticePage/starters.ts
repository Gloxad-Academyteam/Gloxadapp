import type { TPracticeFile, TPracticeLanguage } from "@services/practice";

export const LANGUAGES: { id: TPracticeLanguage; label: string; blurb: string }[] = [
  { id: "javascript", label: "JavaScript", blurb: "Run code and see the console output straight away." },
  { id: "python", label: "Python", blurb: "Real Python in your browser. The first run downloads it once." },
  { id: "web", label: "HTML, CSS & JS", blurb: "Build a web page and watch it update as you type." },
];

export const STARTERS: Record<TPracticeLanguage, TPracticeFile[]> = {
  javascript: [{ name: "main.js", content: '// Write JavaScript here and press Run\nconsole.log("Hello, Gloxad!");\n' }],
  python: [{ name: "main.py", content: '# Write Python here and press Run\nprint("Hello, Gloxad!")\n' }],
  web: [
    { name: "index.html", content: '<h1>Hello, Gloxad!</h1>\n<p>Edit the files and watch this page change.</p>\n<button id="go">Click me</button>\n' },
    { name: "style.css", content: "body { font-family: sans-serif; padding: 24px; }\nh1 { color: #0B1F4D; }\n" },
    { name: "script.js", content: 'document.getElementById("go").addEventListener("click", () => {\n  console.log("Clicked!");\n});\n' },
  ],
};

export const languageLabel = (id: TPracticeLanguage) => LANGUAGES.find((entry) => entry.id === id)?.label ?? id;
