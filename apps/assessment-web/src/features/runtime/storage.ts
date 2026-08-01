"use client";

import type { AssessmentAnswerSnapshot } from "@seek/contracts";

const storagePrefix = "seek.assessment.snapshot";
const dbName = "seek-assessment-runtime";
const storeName = "snapshots";

function getStorageKey(attemptId: string) {
  return `${storagePrefix}.${attemptId}`;
}

export interface RuntimeSnapshotStorage {
  load(attemptId: string, unlockKey?: string): Promise<AssessmentAnswerSnapshot | null>;
  save(snapshot: AssessmentAnswerSnapshot, unlockKey?: string): Promise<void>;
  clear(attemptId: string): Promise<void>;
}

async function encrypt(text: string, keyText: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto) return text;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Pad/slice key to 32 bytes for AES-256
  const rawKey = encoder.encode(keyText.padEnd(32, "0").substring(0, 32));
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );
  
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const dataHex = Array.from(new Uint8Array(encrypted))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${ivHex}:${dataHex}`;
}

async function decrypt(cipherText: string, keyText: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto) return cipherText;
  const parts = cipherText.split(":");
  if (parts.length !== 2) throw new Error("Invalid cipher text format");
  
  const ivHex = parts[0];
  const dataHex = parts[1];
  
  const iv = new Uint8Array(
    ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  const data = new Uint8Array(
    dataHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  
  const encoder = new TextEncoder();
  const rawKey = encoder.encode(keyText.padEnd(32, "0").substring(0, 32));
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    data
  );
  
  return new TextDecoder().decode(decrypted);
}

function openSnapshotDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }

    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName, { keyPath: "attemptId" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToIndexedDb(attemptId: string, encryptedData: string) {
  const db = await openSnapshotDb();
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).put({ attemptId, encryptedData });
  db.close();
}

async function loadFromIndexedDb(attemptId: string): Promise<string | null> {
  const db = await openSnapshotDb();
  return new Promise<string | null>((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).get(attemptId);
    req.onsuccess = () => {
      resolve(req.result ? req.result.encryptedData : null);
    };
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function clearFromIndexedDb(attemptId: string) {
  const db = await openSnapshotDb();
  const tx = db.transaction(storeName, "readwrite");
  tx.objectStore(storeName).delete(attemptId);
  db.close();
}

export const runtimeSnapshotStorage: RuntimeSnapshotStorage = {
  async load(attemptId, unlockKey) {
    if (typeof window === "undefined") return null;

    const key = unlockKey || attemptId;
    try {
      // Try to load from IndexedDB first
      let encryptedData = await loadFromIndexedDb(attemptId);
      
      // Fallback to LocalStorage
      if (!encryptedData) {
        encryptedData = window.localStorage.getItem(getStorageKey(attemptId));
      }
      
      if (!encryptedData) return null;
      
      const decrypted = await decrypt(encryptedData, key);
      return JSON.parse(decrypted) as AssessmentAnswerSnapshot;
    } catch (e) {
      console.warn("Failed to decrypt or parse snapshot storage:", e);
      return null;
    }
  },
  async save(snapshot, unlockKey) {
    if (typeof window === "undefined") return;

    const key = unlockKey || snapshot.attemptId;
    try {
      const rawText = JSON.stringify(snapshot);
      const encryptedData = await encrypt(rawText, key);
      
      await saveToIndexedDb(snapshot.attemptId, encryptedData);
      window.localStorage.setItem(getStorageKey(snapshot.attemptId), encryptedData);
    } catch (e) {
      console.error("Failed to save snapshot storage:", e);
    }
  },
  async clear(attemptId) {
    if (typeof window === "undefined") return;

    try {
      await clearFromIndexedDb(attemptId);
      window.localStorage.removeItem(getStorageKey(attemptId));
    } catch (e) {
      console.error("Failed to clear snapshot storage:", e);
    }
  },
};
