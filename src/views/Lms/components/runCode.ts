// Runs student JavaScript in a Web Worker so it can never touch the page (no DOM, no localStorage)
// and an infinite loop can be stopped by terminating the worker after a timeout.

export type TLogLevel = "log" | "info" | "warn" | "error";
export type TLogLine = { level: TLogLevel; text: string };
export type TTestResult = { name: string; passed: boolean; message?: string };
export type TRunResult = {
  logs: TLogLine[];
  tests: TTestResult[];
  // Uncaught error thrown by the student's code (syntax error, ReferenceError, ...)
  error?: string;
  timedOut?: boolean;
  ms: number;
};

const MAX_LOG_LINES = 500;

// Written as a string so it can be turned into a Blob worker; it never runs on the page itself.
const WORKER_SOURCE = `
self.onmessage = (event) => {
  const { code, tests } = event.data;
  const logs = [];
  const results = [];
  const started = Date.now();
  const format = (value) => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.stack || String(value);
    try { const text = JSON.stringify(value); return text === undefined ? String(value) : text; } catch (e) { return String(value); }
  };
  for (const level of ["log", "info", "warn", "error"]) {
    console[level] = (...args) => {
      if (logs.length < ${MAX_LOG_LINES}) logs.push({ level, text: args.map(format).join(" ") });
    };
  }
  self.test = (name, fn) => {
    try { fn(); results.push({ name, passed: true }); }
    catch (err) { results.push({ name, passed: false, message: String((err && err.message) || err) }); }
  };
  self.assertEqual = (actual, expected, message) => {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) throw new Error(message || "Expected " + b + " but got " + a);
  };
  let error;
  try {
    (0, eval)(code);
    if (tests) (0, eval)(tests);
  } catch (err) {
    error = err && err.name ? err.name + ": " + (err.message || "") : String(err);
  }
  self.postMessage({ logs, tests: results, error, ms: Date.now() - started });
};
`;

export const runCode = (code: string, tests?: string, timeoutMs = 4000): Promise<TRunResult> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
    const worker = new Worker(url);
    const started = performance.now();

    const finish = (result: TRunResult) => {
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };

    const timer = window.setTimeout(
      () =>
        finish({
          logs: [],
          tests: [],
          error: `Your code took longer than ${timeoutMs / 1000} seconds to run and was stopped. Check for an infinite loop.`,
          timedOut: true,
          ms: Math.round(performance.now() - started),
        }),
      timeoutMs
    );

    worker.onmessage = (event: MessageEvent<TRunResult>) => finish(event.data);
    worker.onerror = (event) => {
      event.preventDefault();
      finish({ logs: [], tests: [], error: event.message || "The code could not be run.", ms: Math.round(performance.now() - started) });
    };
    worker.postMessage({ code, tests });
  });
