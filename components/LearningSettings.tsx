"use client";
import { useEffect, useState } from "react";
import { Download, Check, RefreshCw, WifiOff } from "lucide-react";
import type { Profile } from "../lib/types";
import type { DeviceStatus, LearningClient } from "../lib/learning-client";
import {
  downloadPack,
  packStatus,
  removePack,
  type PackStatus,
} from "../lib/offline-pack";
export default function LearningSettings({
  profile,
  prefs,
  device,
  status,
  onError,
  onResolved,
  beforeResolve,
}: {
  profile: Profile;
  prefs: (p: Partial<Profile>) => Promise<void>;
  device: LearningClient;
  status: DeviceStatus;
  onError: (message: string) => void;
  onResolved: () => void;
  beforeResolve: () => Promise<unknown>;
}) {
  const [pack, setPack] = useState<PackStatus>({ ready: false, size: 0 }),
    [busy, setBusy] = useState(false),
    [downloadProgress, setDownloadProgress] = useState("");
  useEffect(() => {
    packStatus()
      .then(setPack)
      .catch((e) => onError(e.message));
  }, [onError]);
  const change = (key: keyof Profile, value: boolean) =>
    prefs({ [key]: value }).catch((e) => onError(e.message));
  const choices: [keyof Profile, string, string][] = [
    [
      "aiEnabled",
      "AI assistant",
      "Enabled by default. Live answers need internet and your API key. Turning this off stops AI requests.",
    ],
    [
      "hintsEnabled",
      "Lesson hints",
      "Show written hints and smaller steps. These work offline.",
    ],
    [
      "analogiesEnabled",
      "Familiar examples",
      "Show simple comparisons, such as a labeled box for a variable.",
    ],
    [
      "mathEnabled",
      "Math connections",
      "Include the matching math question where it helps the coding topic.",
    ],
    [
      "rewardsEnabled",
      "XP, streaks, and badges",
      "Show game rewards. Your completed work stays saved when these are hidden.",
    ],
    [
      "largeText",
      "Larger reading text",
      "Make lesson explanations and instructions easier to read.",
    ],
  ];
  return (
    <>
      <section className="panel">
        <h3>Help while you learn</h3>
        {choices.map(([key, title, text]) => (
          <label className="setting-row" key={key}>
            <span>
              <b>{title}</b>
              <small>{text}</small>
            </span>
            <input
              type="checkbox"
              checked={!!profile[key]}
              onChange={(e) => change(key, e.target.checked)}
            />
          </label>
        ))}
      </section>
      <section className="panel">
        <h3>
          <WifiOff size={21} /> Learning offline
        </h3>
        <p>
          Download all 103 lessons, projects, and coding tools while you’re
          online. Then you can reopen the app and learn without a connection.
        </p>
        <span className={"connection " + (pack.ready ? "connected" : "")}>
          {pack.ready ? <Check size={16} /> : <Download size={16} />}{" "}
          {pack.ready
            ? "Offline pack ready on this device"
            : "Download once before going offline"}
        </span>
        {pack.size > 0 && (
          <p className="muted">
            {(pack.size / 1e6).toFixed(1)} MB
            {pack.downloadedAt
              ? " · Downloaded " +
                new Date(pack.downloadedAt).toLocaleDateString()
              : ""}
          </p>
        )}
        {pack.error && <p className="notice">{pack.error}</p>}
        <div className="button-row">
          <button
            className="primary"
            disabled={busy || !status.online || !status.storageAvailable}
            onClick={async () => {
              setBusy(true);
              setDownloadProgress("Preparing your download…");
              try {
                await device.sync(true);
                await downloadPack((done, total) =>
                  setDownloadProgress(`Downloaded ${done} of ${total} files`),
                );
                setPack(await packStatus());
                setDownloadProgress("Ready. You can use this device offline.");
              } catch (e) {
                onError((e as Error).message);
                setDownloadProgress(
                  "Download unfinished. Reconnect and try again.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            <Download size={17} />
            {busy
              ? "Downloading…"
              : pack.ready
                ? "Update offline pack"
                : "Download offline pack"}
          </button>
          {pack.size > 0 && (
            <button
              className="secondary"
              disabled={busy}
              onClick={async () => {
                try {
                  await removePack();
                  setPack({ ready: false, size: 0 });
                  setDownloadProgress(
                    "Downloads removed. Your saved work and pending changes are kept.",
                  );
                } catch (e) {
                  onError((e as Error).message);
                }
              }}
            >
              Remove downloads
            </button>
          )}
        </div>
        <p role="status" className="muted">
          {downloadProgress}
        </p>
        <label className="setting-row">
          <span>
            <b>Sync when connected</b>
            <small>
              Send device saves to your private account when the app is open and
              you reconnect. Turning this off keeps changes on this device until
              you press Sync now.
            </small>
          </span>
          <input
            type="checkbox"
            checked={profile.autoSync}
            onChange={(e) => change("autoSync", e.target.checked)}
          />
        </label>
        <div className="button-row">
          <button
            className="secondary"
            disabled={status.syncing}
            onClick={() => device.sync(true).catch((e) => onError(e.message))}
          >
            <RefreshCw size={17} />
            {status.syncing ? "Syncing…" : "Sync now"}
          </button>
          <span>
            {status.pending
              ? `${status.pending} changes waiting to sync`
              : "No changes waiting to sync"}
          </span>
        </div>
        {status.error && (
          <p role="alert" className="notice">
            {status.error}
          </p>
        )}
        {status.conflict && (
          <div className="notice">
            <b>Two project copies are kept</b>
            <p>{status.conflict.message}</p>
            <p>Choosing a copy keeps the other in saved history.</p>
            <div className="button-row">
              {(["device", "account"] as const).map((which) => (
                <button
                  className="secondary"
                  key={which}
                  onClick={async () => {
                    try {
                      await beforeResolve();
                      await device.resolve(which);
                      onResolved();
                    } catch (e) {
                      onError((e as Error).message);
                    }
                  }}
                >
                  {which === "device"
                    ? "Keep my device copy"
                    : "Use my account copy"}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="muted">
          Downloaded work is available to anyone using this browser profile. Use
          a personal device. Your API key is never included. Browsers can remove
          downloads to free space; check the ready status before a trip.
        </p>
        <p className="muted">
          AI answers need internet. Swift uses the Mac companion; SwiftUI needs
          Xcode. New packages, websites, and deployment steps may also need a
          connection.
        </p>
      </section>
    </>
  );
}
