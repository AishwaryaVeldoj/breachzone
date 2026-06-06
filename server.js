const http = require("http");

const rules = [
  ["Prompt Injection", /ignore previous|system prompt|developer message|bypass|jailbreak|override policy/i, 35],
  ["Identity Spoofing", /manager approved|act as admin|impersonate|spoof|signed by/i, 25],
  ["Unauthorized Access", /export|delete|bank|payment|secret|credential|database|private/i, 25],
  ["Adversarial Misuse", /phishing|malware|exploit|attack|payload|exfiltrate/i, 20],
];

function scanText(text = "") {
  const hits = rules
    .filter(([, pattern]) => pattern.test(text))
    .map(([name, , weight]) => ({ name, weight }));
  const score = Math.min(100, hits.reduce((total, hit) => total + hit.weight, text.trim() ? 8 : 0));
  const severity = score > 70 ? "Critical" : score > 40 ? "High" : score > 15 ? "Medium" : "Low";
  const decision = score > 40 ? "Block" : score > 15 ? "Review" : "Allow";
  return { score, severity, decision, hits, scannedAt: new Date().toISOString() };
}

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method === "GET" && req.url === "/health") return send(res, 200, { ok: true });
  if (req.method !== "POST" || req.url !== "/api/scan") return send(res, 404, { error: "Not found" });

  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 1_000_000) req.destroy();
  });
  req.on("end", () => {
    try {
      const body = raw ? JSON.parse(raw) : {};
      send(res, 200, scanText(body.text || ""));
    } catch {
      send(res, 400, { error: "Invalid JSON" });
    }
  });
});

const port = process.env.PORT || 5050;
server.listen(port, "127.0.0.1", () => {
  console.log(`BreachZone realtime API running at http://127.0.0.1:${port}`);
});
