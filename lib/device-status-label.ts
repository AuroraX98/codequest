import type { DeviceStatus } from "./learning-client";
/** A healthy connection needs no banner; show only useful save/sync context. */
export function deviceStatusLabel(status: DeviceStatus, localMode: boolean): string {
  const parts: string[] = [];
  if (localMode) parts.push("Local mode · This computer");
  if (!status.online) parts.push("Offline on this device");
  if (status.pending > 0) parts.push(`${status.pending} changes waiting to sync`);
  if (status.conflict) parts.push("Sync conflict needs review");
  else if (status.error) parts.push("Sync needs attention");
  if (!status.storageAvailable) parts.push("Device saving unavailable");
  return parts.join(" · ");
}
