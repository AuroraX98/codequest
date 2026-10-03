import type { Lesson, RunResult } from "./types";
import { runnerAssets, staticResponse } from "./offline-pack";
export async function runProject(
  frame: HTMLIFrameElement,
  lesson: Lesson,
  code: string,
  signal?: AbortSignal,
): Promise<RunResult> {
  const stop = () => ({
    output: [],
    checks: [],
    error: "Run stopped. Your code is still here.",
  });
  if (signal?.aborted) return stop();
  let abortLoad: (() => void) | undefined;
  const loading = Promise.all([
    staticResponse("/runner/frame.html").then((r) => r.text()),
    runnerAssets(lesson.runtime),
  ]);
  const aborted = new Promise<never>((_, reject) => {
    abortLoad = () => reject(new DOMException("Run stopped.", "AbortError"));
    signal?.addEventListener("abort", abortLoad, { once: true });
  });
  let markup: string,
    assets: Record<string, { bytes: ArrayBuffer; type: string }>;
  try {
    [markup, assets] = await Promise.race([loading, aborted]);
  } finally {
    if (abortLoad) signal?.removeEventListener("abort", abortLoad);
  }
  if (signal?.aborted) return stop();
  return new Promise((resolve) => {
    const id = crypto.randomUUID();
    let sent = false,
      finished = false;
    const done = (result: RunResult) => {
      if (finished) return;
      finished = true;
      frame.onload = null;
      clearTimeout(timer);
      window.removeEventListener("message", listener);
      signal?.removeEventListener("abort", cancel);
      resolve(result);
    };
    const cancel = () => {
      frame.contentWindow?.postMessage({ type: "stop", id }, "*");
      frame.srcdoc = "";
      done(stop());
    };
    const send = () => {
      if (!sent && !finished) {
        sent = true;
        frame.contentWindow?.postMessage(
          { type: "run", id, lesson, code, assets },
          "*",
        );
      }
    };
    const listener = (e: MessageEvent) => {
      if (
        e.source === frame.contentWindow &&
        e.data?.id === id &&
        e.data.type === "result"
      )
        done(e.data.result);
    };
    window.addEventListener("message", listener);
    signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(
      () => {
        frame.srcdoc = "";
        done({
          output: [],
          checks: [],
          error:
            "This run took too long and was stopped. Try a smaller loop or run again if Python was still loading.",
        });
      },
      lesson.runtime === "python"
        ? 60000
        : ["typescript", "react"].includes(lesson.runtime)
          ? 25000
          : 10000,
    );
    frame.onload = send;
    frame.removeAttribute("src");
    frame.srcdoc = markup;
  });
}
