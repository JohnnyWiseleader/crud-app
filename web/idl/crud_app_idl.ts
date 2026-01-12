import raw from "../../anchor/target/idl/crud_app.json";
import type { CrudApp } from "../../anchor/target/types/crud_app";

// minimal snake_case -> camelCase for Anchor IDL names
const camel = (s: string) =>
  s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());

function camelizeIdl(obj: any): any {
  if (Array.isArray(obj)) return obj.map(camelizeIdl);
  if (!obj || typeof obj !== "object") return obj;

  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    // keys like "system_program" are *keys in JSON*, keep them
    // but values like { name: "journal_entry" } must be camelized.
    out[k] = camelizeIdl(v);
  }

  // Anchor cares about these name fields
  if (typeof out.name === "string") out.name = camel(out.name);
  if (typeof out.path === "string") out.path = camel(out.path);

  return out;
}

// This produces the same shape as your generated CrudApp type expects
export const IDL = camelizeIdl(raw) as CrudApp;
