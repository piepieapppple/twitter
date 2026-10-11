export default async function handler(req, res) {
res.setHeader(“Cache-Control”, “no-store”);

if (req.method !== “GET”) {
return res.status(405).json({ error: “GET 요청만 지원합니다.” });
}

const url = String(req.query.url || “”);

if (!/^https?://(www.)?(x.com|twitter.com)/[^/]+/status/\d+/i.test(url)) {
return res.status(400).json({ error: “올바른 X 게시물 링크를 입력해 주세요.” });
}

const key = process.env.TWITTERAPIS_KEY;

if (!key) {
return res.status(500).json({
error: “API 키가 아직 설정되지 않았습니다.”
});
}

try {
const endpoint = “https://api.twitterapis.com/twitter/tweet/retweeters”;
const params = new URLSearchParams({ url });

const response = await fetch(`${endpoint}?${params}`, {
  headers: {
    Authorization: `Bearer ${key}`,
    Accept: "application/json"
  }
});
const body = await response.json().catch(() => ({}));
if (!response.ok) {
  return res.status(502).json({
    error: "RT 목록 조회에 실패했습니다. API 설정을 확인해 주세요."
  });
}
return res.status(200).json({
  users: Array.isArray(body.users) ? body.users : []
});

} catch {
return res.status(500).json({
error: “API 연결에 실패했습니다.”
});
}
}
