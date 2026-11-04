import type { Lesson, RunResult } from "./types";
import { runnerAssets, staticResponse } from "./offline-pack";
/** Native method=dialog needs form permission, while all network submissions stay blocked. */
export function projectSandbox(lesson: Pick<Lesson, "id" | "runtime">, markup: string): string {
  if (lesson.id !== "html-15" || lesson.runtime !== "html") return "allow-scripts";
  const document = new DOMParser().parseFromString(markup, "text/html");
  const protectedFrame = Array.from(document.querySelectorAll('head meta[http-equiv]')).some(meta =>
    meta.getAttribute("http-equiv")?.toLowerCase() === "content-security-policy" &&
    /(?:^|;)\s*form-action\s+'none'\s*(?:;|$)/.test(meta.getAttribute("content") ?? ""),
  );
  if (!protectedFrame) throw new Error("The dialog preview needs updated offline files. Connect and update the offline pack, then run again.");
  return "allow-scripts allow-forms";
}
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
  const sandbox = projectSandbox(lesson, markup);
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
    frame.setAttribute("sandbox", sandbox);
    frame.removeAttribute("src");
    frame.srcdoc = markup;
  });
}
