import type { AppData, ServiceStatus, User } from "./types";



export const STATUS_OPTIONS: ServiceStatus[] = [
  "Received",
  "Assigned",
  "Diagnosing",
  "Waiting Parts",
  "Repaired",
  "Delivered",
  "Cancelled",
  "Request Reassign",
  "Returned",
];

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

export const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const createDefaultData = (): AppData => ({
  users: [
    { id: "ADMIN", name: "Amit Anurup (Master)", role: "admin", pin: "0000", email: "amitanurup@gmail.com" },
    { id: "ADMIN_GCC", name: "Amrut Amrup (GCC Master)", role: "admin", pin: "0000", email: "gccbhubaneswar@gmail.com" },
  ],
  inventory: [],
  jobs: [],
});

export const engineerName = (id: string, users: User[]) =>
  users.find((user) => user.id === id)?.name ?? "Unassigned";
