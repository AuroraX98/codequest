"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { LessonReadingRecord } from "./lesson-completion";

export type ReadingProgressState = {
  scope: string;
  records: LessonReadingRecord[];
  loaded: boolean;
  loading: boolean;
  online: boolean;
  error: string;
  pending: Record<string, boolean>;
  errors: Record<string, string>;
  needsRefresh: Record<string, boolean>;
};

export type ReadingProgress = ReadingProgressState & {
  refresh: () => Promise<void>;
  setChecked: (
    lessonId: string,
    sectionKey: string,
    checked: boolean,
  ) => Promise<boolean>;
};

export function readingRecordKey(lessonId: string, sectionKey: string) {
  return JSON.stringify([lessonId, sectionKey]);
}

export function findReadingRecord(
  records: readonly LessonReadingRecord[],
  lessonId: string,
  sectionKey: string,
) {
  return records.find(
    (record) =>
      record.lessonId === lessonId && record.sectionKey === sectionKey,
  );
}

function onlineNow() {
  return typeof navigator === "undefined" || navigator.onLine !== false;
}

class ReadingRequestError extends Error {
  constructor(
    message: string,
    readonly needsRefresh = false,
  ) {
    super(message);
  }
}

function validDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

function readRecord(input: unknown): LessonReadingRecord {
  const record = input as LessonReadingRecord | null;
  if (
    !record ||
    typeof record.lessonId !== "string" ||
    !record.lessonId ||
    record.lessonId.length > 200 ||
    typeof record.sectionKey !== "string" ||
    !record.sectionKey ||
    record.sectionKey.length > 200 ||
    typeof record.checked !== "boolean" ||
    !validDate(record.updatedAt) ||
    (record.checked ? !validDate(record.markedAt) : record.markedAt !== null)
  ) {
    throw new ReadingRequestError(
      "The account returned an unreadable reading record. Reload reading progress before making changes.",
      true,
    );
  }
  return {
    lessonId: record.lessonId,
    sectionKey: record.sectionKey,
    checked: record.checked,
    markedAt: record.markedAt,
    updatedAt: record.updatedAt,
  };
}

function readRecords(input: unknown) {
  if (!Array.isArray(input) || input.length > 10000) {
    throw new ReadingRequestError(
      "Your account reading progress could not be read.",
    );
  }
  const records = input.map(readRecord);
  const identities = new Set(
    records.map((record) =>
      readingRecordKey(record.lessonId, record.sectionKey),
    ),
  );
  if (identities.size !== records.length) {
    throw new ReadingRequestError(
      "Your account returned duplicate reading records.",
    );
  }
  return records;
}

/** One account-wide client, never one fetch per lesson or section. */
export class ReadingClient {
  private state: ReadingProgressState;
  private listeners = new Set<() => void>();
  private controllers = new Set<AbortController>();
  private generation = 0;
  private active = true;
  private loadFlight?: Promise<void>;

  constructor(readonly scope: string) {
    this.state = {
      scope,
      records: [],
      loaded: false,
      loading: false,
      online: onlineNow(),
      error: "",
      pending: {},
      errors: {},
      needsRefresh: {},
    };
  }

  getSnapshot = () => this.state;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private update(next: Partial<ReadingProgressState>) {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((listener) => listener());
  }

  setOnline = (online: boolean) => {
    this.update({ online });
  };

  /** Invalidate responses from a previous account or an unmounted owner. */
  cancel = () => {
    this.active = false;
    this.generation++;
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
    this.loadFlight = undefined;
    this.update({ loading: false, pending: {} });
  };

  private async request(body?: {
    lessonId: string;
    sectionKey: string;
    checked: boolean;
    expectedUpdatedAt: string | null;
  }) {
    if (!/^[a-f0-9]{64}$/.test(this.scope)) {
      throw new ReadingRequestError(
        "Sign in to load or save your reading progress.",
      );
    }
    if (!onlineNow()) {
      this.setOnline(false);
      throw new ReadingRequestError(
        "You're offline. Reconnect to load or save reading progress. Nothing has been queued.",
      );
    }
    const controller = new AbortController();
    this.controllers.add(controller);
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(
        body
          ? "/api/reading"
          : `/api/reading?${new URLSearchParams({ scope: this.scope })}`,
        {
          method: body ? "POST" : "GET",
          credentials: "same-origin",
          cache: "no-store",
          headers: {
            Accept: "application/json",
            ...(body ? { "Content-Type": "application/json" } : {}),
          },
          ...(body
            ? { body: JSON.stringify({ accountScope: this.scope, ...body }) }
            : {}),
          signal: controller.signal,
        },
      );
      if (
        response.redirected ||
        response.status === 401 ||
        response.status === 403 ||
        !response.headers.get("content-type")?.includes("application/json")
      ) {
        throw new ReadingRequestError(
          "Sign in to the original learning account, then reload reading progress.",
          !!body,
        );
      }
      const value: unknown = await response.json();
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new ReadingRequestError(
          "Your account returned an unreadable response.",
          !!body,
        );
      }
      const payload = value as Record<string, unknown>;
      if (response.status === 409) {
        throw new ReadingRequestError(
          "This reading mark changed in another tab or device. Reload reading progress before changing it again.",
          true,
        );
      }
      if (!response.ok) {
        throw new ReadingRequestError(
          typeof payload.error === "string"
            ? payload.error.slice(0, 500)
            : "Your account could not confirm this change. Reload reading progress before trying again.",
          !!body,
        );
      }
      if (payload.accountScope !== this.scope) {
        throw new ReadingRequestError(
          "Your learning account changed. No reading records from that account were shown here. Sign in again and reload.",
          !!body,
        );
      }
      return payload;
    } catch (error) {
      if (error instanceof ReadingRequestError) throw error;
      throw new ReadingRequestError(
        body
          ? "Could not confirm whether your reading mark was saved. Reload reading progress to check before trying again."
          : "Could not load your account reading progress. Reconnect and reload to see your saved score.",
        !!body,
      );
    } finally {
      clearTimeout(timeout);
      this.controllers.delete(controller);
    }
  }

  initialize = () => {
    this.active = true;
    return this.state.loaded ? Promise.resolve() : this.refresh();
  };

  refresh = (): Promise<void> => {
    if (!this.active) return Promise.resolve();
    if (this.loadFlight) return this.loadFlight;
    // A refresh must not overwrite an acknowledged save with an older snapshot.
    if (Object.values(this.state.pending).some(Boolean))
      return Promise.resolve();
    const generation = this.generation;
    this.update({ loading: true, error: "" });
    const flight = (async () => {
      try {
        const payload = await this.request();
        const records = readRecords(payload.reading);
        if (generation !== this.generation) return;
        this.update({
          records,
          loaded: true,
          online: true,
          errors: {},
          needsRefresh: {},
        });
      } catch (error) {
        if (generation !== this.generation) return;
        this.update({
          error:
            error instanceof Error
              ? error.message
              : "Could not load reading progress.",
        });
      } finally {
        if (generation === this.generation) {
          this.loadFlight = undefined;
          this.update({ loading: false });
        }
      }
    })();
    this.loadFlight = flight;
    return flight;
  };

  /** Called only by the learner's explicit checked/unchecked action. */
  setChecked = async (
    lessonId: string,
    sectionKey: string,
    checked: boolean,
  ) => {
    const key = readingRecordKey(lessonId, sectionKey);
    if (
      !this.active ||
      !this.state.loaded ||
      this.state.loading ||
      this.state.pending[key] ||
      this.state.needsRefresh[key] ||
      !lessonId ||
      !sectionKey ||
      typeof checked !== "boolean"
    )
      return false;
    const prior = findReadingRecord(this.state.records, lessonId, sectionKey);
    if (prior?.checked === checked) return true;
    const generation = this.generation;
    this.update({
      pending: { ...this.state.pending, [key]: true },
      errors: { ...this.state.errors, [key]: "" },
    });
    try {
      const payload = await this.request({
        lessonId,
        sectionKey,
        checked,
        expectedUpdatedAt: prior?.updatedAt ?? null,
      });
      const record = readRecord(payload.record);
      if (
        record.lessonId !== lessonId ||
        record.sectionKey !== sectionKey ||
        record.checked !== checked ||
        (prior && record.updatedAt <= prior.updatedAt)
      ) {
        throw new ReadingRequestError(
          "The account did not confirm this exact reading mark. Reload reading progress before trying again.",
          true,
        );
      }
      if (generation !== this.generation) return false;
      this.update({
        records: [
          ...this.state.records.filter(
            (saved) =>
              readingRecordKey(saved.lessonId, saved.sectionKey) !== key,
          ),
          record,
        ],
        online: true,
      });
      return true;
    } catch (error) {
      if (generation !== this.generation) return false;
      this.update({
        errors: {
          ...this.state.errors,
          [key]:
            error instanceof Error
              ? error.message
              : "Reading progress was not confirmed.",
        },
        needsRefresh: {
          ...this.state.needsRefresh,
          [key]: error instanceof ReadingRequestError && error.needsRefresh,
        },
      });
      return false;
    } finally {
      if (generation === this.generation) {
        this.update({ pending: { ...this.state.pending, [key]: false } });
      }
    }
  };
}

/** Call once in the account owner, then pass this result down to all lessons. */
export function useReadingProgress(scope: string): ReadingProgress {
  const client = useMemo(() => new ReadingClient(scope), [scope]);
  const state = useSyncExternalStore(
    client.subscribe,
    client.getSnapshot,
    client.getSnapshot,
  );
  useEffect(() => {
    if (scope) void client.initialize();
    const online = () => client.setOnline(onlineNow());
    window.addEventListener("online", online);
    window.addEventListener("offline", online);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", online);
      client.cancel();
    };
  }, [client, scope]);
  return { ...state, refresh: client.refresh, setChecked: client.setChecked };
}
