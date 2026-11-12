import type { TLabTest } from "@services/lms";
import { createPythonSession } from "../../PracticePage/runners";
import { runCode, type TRunResult } from "./runCode";

// A lab's tests are "input in, printed output out". Each visible test runs the student's code once with that input and the
// printed output is compared with the expected output, ignoring trailing spaces. Hidden tests never reveal their expected
// output, so they cannot run in the browser; results are stored as unverified until a server-side runner exists.

export const RUNNABLE = ["javascript", "typescript", "python"] as const;
export const isRunnable = (language: string) => (RUNNABLE as readonly string[]).includes(language);

const same = (actual: string, expected: string) => actual.replace(/\s+$/gm, "").trim() === expected.replace(/\s+$/gm, "").trim();

let python: ReturnType<typeof createPythonSession> | null = null;

const javascriptRunner = (cases: TLabTest[]) => async (code: string): Promise<TRunResult> => {
  // The student's code is run inside the tests, once per case, with `input` set and console.log captured
  const tests = `
const __code = ${JSON.stringify(code)};
const __cases = ${JSON.stringify(cases.map(({ name, input, expectedOutput }) => ({ name, input, expectedOutput })))};
const __same = ${same.toString()};
for (const c of __cases) {
  test(c.name, () => {
    const printed = [];
    const out = (...args) => printed.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    new Function("input", "console", __code)(c.input, { log: out, info: out, warn: out, error: out });
    const actual = printed.join("\\n");
    if (!__same(actual, c.expectedOutput)) throw new Error("Expected " + JSON.stringify(c.expectedOutput) + " but printed " + JSON.stringify(actual));
  });
}`;
  return runCode("", tests, 8000);
};

const pythonRunner = (cases: TLabTest[]) => async (code: string): Promise<TRunResult> => {
  python ||= createPythonSession();
  const started = performance.now();
  const results: TRunResult["tests"] = [];
  let error: string | undefined;
  for (const test of cases) {
    const run = await python.run(code, 10000, test.input);
    const printed = run.logs.filter((line) => line.level === "log").map((line) => line.text).join("\n");
    if (run.error) {
      results.push({ name: test.name, passed: false, message: run.error });
      if (run.timedOut) error = run.error;
    } else if (same(printed, test.expectedOutput)) results.push({ name: test.name, passed: true });
    else results.push({ name: test.name, passed: false, message: `Expected ${JSON.stringify(test.expectedOutput)} but printed ${JSON.stringify(printed)}` });
  }
  return { logs: [], tests: results, error, ms: Math.round(performance.now() - started) };
};

/** A runner for the lab's visible tests, or null when the language cannot be run in the browser. */
export const buildLabRunner = (language: string, tests: TLabTest[]): ((code: string) => Promise<TRunResult>) | null => {
  const visible = tests.filter((test) => !test.hidden);
  if (!isRunnable(language) || visible.length === 0) return null;
  return language === "python" ? pythonRunner(visible) : javascriptRunner(visible);
};
