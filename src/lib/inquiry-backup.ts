// 문의 이중 저장: 디스코드로 보내기 전에 비공개 Vercel Blob(inquiries-private)에 한 건씩 남긴다.
// 2026-11-07 웹후크가 지워져 그동안 문의 알림이 통째로 사라졌다 — 그 대비.
// 6개월 지난 것은 매달 자동으로 지워진다. 저장이 실패해도 디스코드 전송은 그대로 간다.
const SITE = "landing-page";

export async function backupFetch(url: string | URL | Request, init: RequestInit): Promise<Response> {
  const token = process.env.INQUIRY_READ_WRITE_TOKEN;
  const body = init.body;
  const text = typeof body === "string" ? body : body instanceof FormData ? body.get("payload_json") : null;
  if (token && typeof text === "string") {
    try {
      const now = new Date(Date.now() + 9 * 3600 * 1000).toISOString();
      const path = `inquiries/${SITE}/${now.slice(0, 7)}/${now.slice(0, 19).replace(/:/g, "")}.json`;
      await fetch(`https://vercel.com/api/blob/?pathname=${encodeURIComponent(path)}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "x-api-version": "11",
          "x-vercel-blob-access": "private",
          "x-add-random-suffix": "1",
          "x-content-type": "application/json",
        },
        body: text,
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error("문의 백업 저장 실패", err);
    }
  }
  // 대표 웹후크가 죽으면(11/7 처럼 지워지면 404) 예비 웹후크(다른 디스코드 서버)로 다시 보낸다.
  const backup = process.env.DISCORD_WEBHOOK_URL_BACKUP?.trim();
  let res: Response | undefined;
  try {
    res = await fetch(url, init);
    if (res.ok || !backup) return res;
  } catch (err) {
    if (!backup) throw err;
  }
  console.error("디스코드 대표 웹후크 실패 → 예비로 보냄", res?.status);
  return fetch(backup, init);
}
