// Reanimated 3.16's web build reads `__reanimatedLoggerConfig` off the
// global as soon as any worklet-using component imports it. The Babel
// plugin normally injects that config at the top of every file, but on
// web the inject pass runs *after* the first modules load — so if we
// import `Animated` before this stub exists we crash with
// `__reanimatedLoggerConfig is not defined`. Defining it once at the
// very top of the entry side-steps the race without changing behavior.
declare global {
  // eslint-disable-next-line no-var
  var __reanimatedLoggerConfig:
    | {
        strict: boolean;
        level: 'warn' | 'error';
      }
    | undefined;
}

if (typeof globalThis.__reanimatedLoggerConfig === 'undefined') {
  globalThis.__reanimatedLoggerConfig = {
    strict: false,
    level: 'warn',
  };
}

export {};
