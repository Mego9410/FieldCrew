const ENDPOINT =
  "http://127.0.0.1:7645/ingest/a668a102-dde3-42a2-b40c-2c27cb853024";
const SESSION_ID = "00297d";

export function agentLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string,
  runId = "pre-fix"
) {
  // #region agent log
  fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}
