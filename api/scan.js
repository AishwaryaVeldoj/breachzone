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

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  return res.status(200).json(scanText(req.body?.text || ""));
}
