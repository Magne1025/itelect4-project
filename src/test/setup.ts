// ===== SESSION 12: a NEW file =========================================
// ===== no Session 11 version -- nothing to compare it to ==============
// vite.config.ts names this file in test.setupFiles, so Vitest runs it
// before every test file. It is never imported by the app itself.
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Adds checks such as toBeInTheDocument() and toHaveTextContent() to
// expect(), and tells TypeScript they exist.
import "@testing-library/jest-dom/vitest";

// render() puts each component into the same pretend page. Without
// this, the second test would still see what the first one rendered,
// and a "Log In" button could be found twice.
afterEach(() => {
  cleanup();
});
