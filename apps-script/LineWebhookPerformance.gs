/**
 * Safe timing helpers for the production LINE webhook.
 *
 * These logs intentionally contain only stage names, elapsed time and status.
 * They accept only the explicitly allow-listed diagnostic fields below.
 */
function createLineWebhookPerformanceTrace_() {
  return {
    startedAt: Date.now(),
    previousAt: Date.now()
  };
}

function logLineWebhookPerformance_(trace, stage, details) {
  var now = Date.now();
  var safeDetails = details && typeof details === "object" ? details : {};
  var record = {
    stage: String(stage || "UNKNOWN"),
    stepMs: Math.max(0, now - Number(trace && trace.previousAt || now)),
    totalMs: Math.max(0, now - Number(trace && trace.startedAt || now))
  };
  ["status", "messageType", "memberFound", "linked", "visitRecorded", "lineHttpStatus"].forEach(function(key) {
    if (Object.prototype.hasOwnProperty.call(safeDetails, key)) record[key] = safeDetails[key];
  });
  console.log("[TEAM LINK LINE PERF] " + JSON.stringify(record));
  if (trace) trace.previousAt = now;
  return record;
}
