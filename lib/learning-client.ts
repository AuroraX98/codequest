import type { AIProvider } from "./ai-providers";
import type { Lesson, QuestState } from "./types";
import { normalizeProfile } from "./profile";
import { readDevice, writeDevice, editAccount } from "./device-db";
type Reply = QuestState & {
  state?: QuestState;
  error?: string;
  conflict?: boolean;
  correct: boolean;
  feedback: string;
  history?: { id: string; code: string; createdAt: string }[];
  chat: { question: string; answer: string }[];
};
export type Action = {
  action: string;
  unitId?: string;
  code?: string;
  answer?: number;
  checks?: { label: string; passed: boolean }[];
  manualReview?: boolean;
  settings?: Record<string, unknown>;
  backup?: { unitId: string; code: string }[];
  key?: string;
  provider?: AIProvider;
  deviceScope?: string;
  expectedCode?: string;
  completedAt?: string;
};
type Pending = { id: string; body: Action; createdAt: string };
type Version = { id: string; code: string; createdAt: string };
type Conflict = {
  unitId: string;
  localCode: string;
  accountCode: string;
  message: string;
};
type Account = {
  scope: string;
  remote: QuestState;
  queue: Pending[];
  history: Record<string, Version[]>;
  conflict?: Conflict;
};
export type DeviceStatus = {
  online: boolean;
  pending: number;
  syncing: boolean;
  storageAvailable: boolean;
  conflict: Conflict | null;
  error: string;
};
export class LearningClient {
  scope = "";
  current: QuestState;
  status: DeviceStatus = {
    online: true,
    pending: 0,
    syncing: false,
    storageAvailable: true,
    conflict: null,
    error: "",
  };
  private record?: Account;
  private listeners = new Set<(s: QuestState, d: DeviceStatus) => void>();
  private flight?: Promise<void>;
  private retry?: ReturnType<typeof setTimeout>;
  private initFlight?: Promise<QuestState>;
  constructor(
    private lessons: Lesson[],
    private empty: QuestState,
  ) {
    this.current = empty;
  }
  subscribe(fn: (s: QuestState, d: DeviceStatus) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  private emit() {
    for (const fn of this.listeners) fn(this.current, { ...this.status });
  }
  private lesson(id?: string) {
    const l = this.lessons.find((l) => l.id === id);
    if (!l) throw new Error("Choose a known lesson.");
    return l;
  }
  private project(s: QuestState, id: string, l: Lesson) {
    let p = s.progress.find((p) => p.unitId === id);
    if (!p) {
      p = {
        unitId: id,
        code: l.starter,
        quizPassed: 0,
        mathPassed: 0,
        completedAt: null,
        lastRun: null,
        updatedAt: "",
      };
      s.progress.push(p);
    }
    return p;
  }
  private apply(input: QuestState, a: Action, at: string, validate = true) {
    const s = structuredClone(input);
    s.profile = normalizeProfile(s.profile);
    if (a.action === "preferences") {
      s.profile = normalizeProfile({ ...s.profile, ...a.settings });
      return s;
    }
    const l = this.lesson(a.unitId),
      p = this.project(s, l.id, l);
    if (a.action === "save") {
      if (typeof a.code !== "string" || a.code.length > 60000)
        throw new Error("Keep this project below 60,000 characters.");
      p.code = a.code;
    } else if (a.action === "quiz" || a.action === "math") {
      const q = a.action === "math" ? l.math : l.quiz;
      if (!q || !Number.isInteger(a.answer))
        throw new Error("Choose an answer.");
      if (a.answer === q.answer) {
        if (a.action === "quiz") p.quizPassed = 1;
        else p.mathPassed = 1;
      }
    } else if (a.action === "complete") {
      if (
        validate &&
        (!p.quizPassed || (s.profile.mathEnabled && l.math && !p.mathPassed))
      )
        throw new Error("Finish the practice and math question first.");
      if (validate && a.code !== p.code)
        throw new Error("Save your project and run it again.");
      if (validate && l.externalNotes && !a.manualReview)
        throw new Error("Confirm the local project steps first.");
      if (
        validate &&
        (!a.checks ||
          a.checks.length !== l.checks.length ||
          a.checks.some((c, i) => !c.passed || c.label !== l.checks[i].label) ||
          (!l.checks.length && !(l.runtime === "swift" && a.manualReview)))
      )
        throw new Error("Run the project and pass its checks first.");
      if (!validate && typeof a.code === "string") p.code = a.code;
      if (!p.completedAt) {
        p.completedAt = at;
        const day = at.slice(0, 10);
        const activity = s.recentDays.find((d) => d.day === day);
        if (activity) activity.count++;
        else s.recentDays.push({ day, count: 1 });
      }
      p.lastRun = JSON.stringify({
        checks: a.checks,
        manualReview: a.manualReview,
        code: a.code,
      });
    } else throw new Error("This action needs a connection.");
    p.updatedAt = at;
    s.completed = s.progress.filter((p) => p.completedAt).length;
    s.xp = s.completed * 100;
    const today = new Date().toISOString().slice(0, 10);
    s.todayCompleted = s.recentDays.find((d) => d.day === today)?.count ?? 0;
    const days = new Set(
      s.recentDays.filter((d) => d.count > 0).map((d) => d.day),
    );
    const cursor = new Date(today + "T12:00:00Z");
    if (!days.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
    s.streak = 0;
    while (days.has(cursor.toISOString().slice(0, 10))) {
      s.streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    return s;
  }
  private adopt(r: Account) {
    this.record = r;
    let state = { ...r.remote, profile: normalizeProfile(r.remote.profile) };
    for (const q of r.queue)
      state = this.apply(state, q.body, q.createdAt, false);
    this.current = state;
    this.status.pending = r.queue.length;
    this.status.conflict = r.conflict ?? null;
    this.emit();
  }
  private async remote() {
    const r = await fetch("/api/quest", { cache: "no-store" });
    if (r.status === 401 || r.status === 403) {
      await writeDevice("meta", "active-account", null).catch(() => {});
      throw Object.assign(
        new Error("Sign in again before using or syncing this account."),
        { name: "AccountAccessError" },
      );
    }
    if (
      r.redirected ||
      !r.headers.get("content-type")?.includes("application/json")
    ) {
      await writeDevice("meta", "active-account", null).catch(() => {});
      throw Object.assign(
        new Error("Sign in again before opening this account."),
        { name: "AccountAccessError" },
      );
    }
    if (!r.ok)
      throw Object.assign(new Error("Your account could not be reached."), {
        name: "RemoteUnavailableError",
      });
    const d = (await r.json()) as QuestState;
    if (!d.draftScope) throw new Error("A verified account is required.");
    return d;
  }
  async initialize() {
    return (this.initFlight ??= (async () => {
      try {
        const d = await this.remote();
        this.scope = d.draftScope;
        try {
          const record = await editAccount<Account>(this.scope, (r) => ({
            ...r,
            scope: this.scope,
            remote: d,
            queue: r?.queue ?? [],
            history: r?.history ?? {},
          }));
          await writeDevice("meta", "active-account", this.scope);
          this.adopt(record);
        } catch {
          this.status.storageAvailable = false;
          this.current = d;
          this.emit();
        }
        this.status.online = true;
        this.emit();
        if (this.current.profile.autoSync) this.schedule();
        return this.current;
      } catch (e) {
        if (
          (e as Error).name === "AccountAccessError" ||
          (!["TypeError", "RemoteUnavailableError"].includes(
            (e as Error).name,
          ) &&
            navigator.onLine)
        ) {
          // Authentication failures never open a cached account.
          throw e;
        }
        const scope = await readDevice<string>("meta", "active-account");
        if (!scope)
          throw new Error(
            "Open CodeQuest online once and download the offline pack first.",
          );
        const r = await readDevice<Account>("accounts", scope);
        if (!r)
          throw new Error(
            "No saved learning account is available on this device.",
          );
        this.scope = scope;
        this.status.online = false;
        this.adopt(r);
        return this.current;
      }
    })());
  }
  private schedule() {
    clearTimeout(this.retry);
    if (this.status.online && this.current.profile.autoSync)
      this.retry = setTimeout(() => {
        this.sync().catch(() => {});
      }, 350);
  }
  async connectivity(online: boolean) {
    this.status.online = online;
    this.emit();
    if (online && this.current.profile.autoSync) await this.sync();
  }
  private async onlineAction(a: Action, scope = this.scope) {
    const accountChanged = () =>
      this.scope !== scope ||
      (a.deviceScope !== undefined && a.deviceScope !== scope);
    if (accountChanged())
      throw new Error("Account changed. Reopen your key settings.");
    const current = await this.remote();
    if (accountChanged() || current.draftScope !== scope)
      throw new Error(
        "This tab belongs to a different account. Reopen it after signing into the original account.",
      );
    const r = await fetch("/api/quest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...a, deviceScope: a.deviceScope ?? scope }),
    });
    const data = (await r.json()) as Reply;
    if (!r.ok) throw new Error(data.error ?? "Could not save to your account.");
    if (accountChanged())
      throw new Error("Account changed. Reopen your key settings.");
    return data;
  }
  async mutate(
    a: Action,
  ): Promise<
    QuestState | { state: QuestState; correct: boolean; feedback: string }
  > {
    if (["key", "disconnect"].includes(a.action)) {
      const scope = this.scope;
      if (!scope) throw new Error("Your learning account is still loading.");
      if (a.deviceScope !== undefined && a.deviceScope !== scope)
        throw new Error("Account changed. Reopen your key settings.");
      const action = { ...a, deviceScope: a.deviceScope ?? scope };
      if (!navigator.onLine)
        throw new Error(
          "Key settings need an internet connection. Your key is never saved in an offline pack.",
        );
      await this.sync(true);
      if (this.scope !== scope)
        throw new Error("Account changed. Reopen your key settings.");
      const data = (await this.onlineAction(action, scope)) as QuestState;
      if (this.scope !== scope || data.draftScope !== scope)
        throw new Error("Account changed. Reopen your key settings.");
      if (this.status.storageAvailable) {
        const record = await editAccount<Account>(scope, (r) => ({
          ...r!,
          remote: data,
        }));
        if (this.scope !== scope)
          throw new Error("Account changed. Reopen your key settings.");
        this.adopt(record);
      } else {
        this.current = data;
        this.emit();
      }
      return this.current;
    }
    if (a.action === "import") {
      if (!a.backup) throw new Error("Choose a CodeQuest backup.");
      for (const p of a.backup) {
        if (this.lessons.some((l) => l.id === p.unitId))
          await this.mutate({ action: "save", unitId: p.unitId, code: p.code });
      }
      return this.current;
    }
    if (!this.scope) throw new Error("Your learning account is still loading.");
    if (!this.status.storageAvailable) {
      if (!navigator.onLine)
        throw new Error(
          "This browser cannot save offline work. Reconnect before editing.",
        );
      const d = await this.onlineAction(a);
      this.current = (d.state ?? d) as QuestState;
      this.emit();
      return d;
    }
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const record = await editAccount<Account>(this.scope, (r) => {
      if (!r)
        throw new Error(
          "Your device account is missing. Reload CodeQuest online.",
        );
      let before = r.remote;
      for (const q of r.queue)
        before = this.apply(before, q.body, q.createdAt, false);
      const body: Action = structuredClone(a);
      if (body.action === "complete") body.completedAt = now;
      if (a.action === "save") {
        const l = this.lesson(a.unitId);
        body.expectedCode =
          before.progress.find((p) => p.unitId === l.id)?.code ?? l.starter;
        const old = body.expectedCode;
        if (old !== a.code)
          r.history[l.id] = [
            { id, code: old, createdAt: now },
            ...(r.history[l.id] ?? []),
          ].slice(0, 30);
      }
      this.apply(before, body, now);
      // Queue entries stay immutable so an in-flight acknowledgment cannot delete a newer edit.
      r.queue.push({ id, body, createdAt: now });
      return r;
    });
    this.adopt(record);
    this.schedule();
    if (a.action === "quiz" || a.action === "math") {
      const l = this.lesson(a.unitId),
        q = a.action === "math" ? l.math! : l.quiz;
      return {
        state: this.current,
        correct: a.answer === q.answer,
        feedback:
          (a.action === "math" ? q.feedback : q.explanation) ??
          (a.answer === q.answer
            ? "That matches this example."
            : "Read the example and try again."),
      };
    }
    return this.current;
  }
  async sync(force = false) {
    if (this.flight) return this.flight;
    if (!this.status.storageAvailable || !navigator.onLine) return;
    if (!force && !this.current.profile.autoSync) return;
    const replay = async () => {
      this.status.syncing = true;
      this.status.error = "";
      this.emit();
      try {
        const verified = await this.remote();
        this.status.online = true;
        if (verified.draftScope !== this.scope)
          throw new Error(
            "Sync paused: sign into the account that created these device saves.",
          );
        this.adopt(
          await editAccount<Account>(this.scope, (r) => ({
            ...r!,
            remote: verified,
          })),
        );
        for (;;) {
          const record = await readDevice<Account>("accounts", this.scope);
          if (!record || record.conflict || !record.queue.length) break;
          const item = record.queue[0];
          const r = await fetch("/api/quest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...item.body, deviceScope: this.scope }),
          });
          let data;
          try {
            data = (await r.json()) as Reply;
          } catch {
            throw new Error("Sign in again to sync your saved work.");
          }
          if (r.status === 409 && data.conflict && item.body.unitId) {
            const remote = await this.remote();
            if (remote.draftScope !== this.scope)
              throw new Error("Account changed. Sync stopped.");
            const unitId = item.body.unitId;
            const l = this.lesson(unitId);
            const accountCode =
              remote.progress.find((p) => p.unitId === unitId)?.code ??
              l.starter;
            this.adopt(
              await editAccount<Account>(this.scope, (s) => {
                s!.remote = remote;
                s!.conflict = {
                  unitId,
                  localCode: item.body.code ?? "",
                  accountCode,
                  message:
                    "This project changed in your account while this device had another copy. Both copies are kept.",
                };
                return s!;
              }),
            );
            break;
          }
          if (!r.ok)
            throw new Error(
              data.error ??
                "Sync paused. Your changes are kept on this device.",
            );
          const d = (data.state ?? data) as QuestState;
          if (d.draftScope !== this.scope)
            throw new Error("Account changed. Sync stopped.");
          this.adopt(
            await editAccount<Account>(this.scope, (s) => {
              if (!s) throw new Error("Device account missing.");
              if (!s.queue.some((q) => q.id === item.id)) return s;
              s.remote = d;
              s.queue = s.queue.filter((q) => q.id !== item.id);
              return s;
            }),
          );
        }
      } catch (e) {
        this.status.error = (e as Error).message;
        if (
          !navigator.onLine ||
          (e as Error).name === "TypeError" ||
          (e as Error).name === "RemoteUnavailableError"
        ) {
          this.status.online = false;
          this.status.error =
            "You’re offline. Your work is saved here until you reconnect.";
        }
      } finally {
        this.status.syncing = false;
        this.emit();
        this.flight = undefined;
      }
    };
    this.flight = navigator.locks
      ? Promise.resolve(
          navigator.locks.request("codequest-sync-" + this.scope, replay),
        ).then(() => undefined)
      : replay();
    return this.flight;
  }
  async resolve(which: "device" | "account") {
    if (!navigator.onLine)
      throw new Error("Reconnect to compare the two copies.");
    const remote = await this.remote();
    if (remote.draftScope !== this.scope)
      throw new Error(
        "Sign into the original account to resolve this project.",
      );
    const rec = await editAccount<Account>(this.scope, (r) => {
      if (!r?.conflict) return r!;
      const c = r.conflict;
      const latest =
        remote.progress.find((p) => p.unitId === c.unitId)?.code ??
        this.lesson(c.unitId).starter;
      let projected = r.remote;
      for (const pending of r.queue)
        projected = this.apply(
          projected,
          pending.body,
          pending.createdAt,
          false,
        );
      const deviceCode =
        projected.progress.find((p) => p.unitId === c.unitId)?.code ??
        c.localCode;
      r.history[c.unitId] = [
        {
          id: crypto.randomUUID(),
          code: deviceCode,
          createdAt: new Date().toISOString(),
        },
        {
          id: crypto.randomUUID(),
          code: latest,
          createdAt: new Date().toISOString(),
        },
        ...(r.history[c.unitId] ?? []),
      ].slice(0, 30);
      r.remote = remote;
      if (which === "account")
        r.queue = r.queue.filter((q) => q.body.unitId !== c.unitId);
      else {
        const first = r.queue.find((q) => q.body.unitId === c.unitId);
        if (first?.body.action === "save") first.body.expectedCode = latest;
        else if (first)
          r.queue.unshift({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            body: {
              action: "save",
              unitId: c.unitId,
              code: c.localCode,
              expectedCode: latest,
            },
          });
      }
      delete r.conflict;
      return r;
    });
    this.adopt(rec);
    await this.sync(true);
    return this.current;
  }
  async detail(id: string) {
    const local = await readDevice<Account>("accounts", this.scope).catch(
      () => undefined,
    );
    let history = local?.history[id] ?? [];
    let chat: Reply["chat"] = [];
    if (navigator.onLine) {
      try {
        const identity = await this.remote();
        if (identity.draftScope !== this.scope)
          throw new Error("Account changed.");
        const r = await fetch("/api/quest?unit=" + encodeURIComponent(id), {
          cache: "no-store",
        });
        if (r.ok) {
          const d = (await r.json()) as Reply;
          if (d.draftScope !== this.scope)
            throw new Error("Account changed. History kept private.");
          history = [...history, ...(d.history ?? [])]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .filter(
              (v, i, all) => all.findIndex((w) => w.code === v.code) === i,
            )
            .slice(0, 30);
          chat = d.chat;
        }
      } catch {}
    }
    return { history, chat };
  }
}
