import { TEST_LOG_PREFIX } from "@constants/test-constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testLogger = (...rest: any[]) => {
  if (process.env.NODE_ENV === "test") {
    console.info([TEST_LOG_PREFIX, ...rest].reduce((acc, curr) => `${acc} ${curr}`, ""));
  }
};

export default testLogger;
