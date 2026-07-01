import { createDefaultData } from "./data";
import type { AppData, User } from "./types";

export const DATA_KEY = "me24x7-service-desk-data-v1";
export const SESSION_KEY = "me24x7-service-desk-session-v1";

export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) {
      return createDefaultData();
    }
    const parsed = JSON.parse(raw) as AppData;
    if (!Array.isArray(parsed.jobs) || !Array.isArray(parsed.inventory) || !Array.isArray(parsed.users)) {
      return createDefaultData();
    }
    return parsed;
  } catch {
    return createDefaultData();
  }
};

export const saveData = (data: AppData) => {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
};

export const subscribeToServerData = (
  onData: (data: AppData | null) => void,
  onError: () => void
) => {
  let active = true;

  const fetchData = async () => {
    try {
      const res = await fetch("https://etechworld.in/api/get_data.php", {
        headers: { "X-API-KEY": "galaxy_it_repair_secret_key_2026" }
      });
      if (res.ok) {
        const parsed = await res.json();
        if (parsed && Array.isArray(parsed.jobs) && Array.isArray(parsed.inventory) && Array.isArray(parsed.users)) {
          if (active) onData(parsed);
        } else {
          if (active) onData(null);
        }
      } else {
        if (active) onData(null);
      }
    } catch (err) {
      console.error("API sync error:", err);
      if (active) onError();
    }
  };

  fetchData();
  const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds

  return () => {
    active = false;
    clearInterval(intervalId);
  };
};

export const saveServerData = async (data: AppData): Promise<boolean> => {
  try {
    const res = await fetch("https://etechworld.in/api/save_data.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "galaxy_it_repair_secret_key_2026"
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (error) {
    console.error("API save error:", error);
    return false;
  }
};


export const loadSessionUser = (): User | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const saveSessionUser = (user: User | null) => {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

const DB_NAME = "backup-folder-db";
const STORE_NAME = "handles";
const KEY_NAME = "folder-handle";

export const saveFolderHandle = (handle: FileSystemDirectoryHandle): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const putReq = store.put(handle, KEY_NAME);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    request.onerror = () => reject(request.error);
  });
};

export const loadFolderHandle = (): Promise<FileSystemDirectoryHandle | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(KEY_NAME);
      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => reject(getReq.error);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteFolderHandle = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const delReq = store.delete(KEY_NAME);
      delReq.onsuccess = () => resolve();
      delReq.onerror = () => reject(delReq.error);
    };
    request.onerror = () => reject(request.error);
  });
};

export const writeBackupToFolder = async (
  handle: FileSystemDirectoryHandle,
  data: AppData
): Promise<boolean> => {
  try {
    const options = { mode: "readwrite" as const };
    if ((await (handle as any).queryPermission(options)) !== "granted") {
      if ((await (handle as any).requestPermission(options)) !== "granted") {
        return false;
      }
    }
    const fileHandle = await handle.getFileHandle("galaxy_cartridge_care_local_backup.json", { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
    return true;
  } catch (error) {
    console.error("Failed to write backup to local folder:", error);
    return false;
  }
};
