// api/ebay.js
export default async function handler(req, res) {
  const { challenge_code } = req.query;

  if (challenge_code) {
    // must match eBay form exactly
    const verificationToken = "hqautoebaynotificationtoken20251104abcd123";

    // build the exact endpoint eBay called
    const endpoint = `https://${req.headers.host}${req.url.split("?")[0]}`;

    const text = challenge_code + verificationToken + endpoint;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ challengeResponse: hashHex });
  }

  // for later deletion POSTs
  return res.status(200).send("OK");
}
