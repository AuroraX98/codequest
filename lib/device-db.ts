export const DB_NAME = "codequest-device-v1";
let opening: Promise<IDBDatabase> | undefined;
export function deviceDB() {
  if (!opening)
    opening = new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => {
        r.result.createObjectStore("accounts", { keyPath: "scope" });
        r.result.createObjectStore("meta");
      };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => {
        opening = undefined;
        reject(r.error);
      };
      r.onblocked = () => {
        opening = undefined;
        reject(new Error("Close older CodeQuest tabs, then try again."));
      };
    });
  return opening;
}
export async function readDevice<T>(
  store: string,
  key: IDBValidKey,
): Promise<T | undefined> {
  const db = await deviceDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store);
    const r = tx.objectStore(store).get(key);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
export async function writeDevice(
  store: string,
  key: IDBValidKey,
  value: unknown,
) {
  const db = await deviceDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error);
  });
}
export async function editAccount<T extends { scope: string }>(
  scope: string,
  edit: (current: T | undefined) => T,
): Promise<T> {
  const db = await deviceDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("accounts", "readwrite");
    const store = tx.objectStore("accounts");
    const req = store.get(scope);
    let value: T;
    req.onsuccess = () => {
      try {
        value = edit(req.result);
        store.put(value);
      } catch (e) {
        tx.abort();
        reject(e);
      }
    };
    tx.oncomplete = () => resolve(value);
    tx.onabort = () =>
      reject(tx.error ?? new Error("Your device could not save this change."));
  });
}
