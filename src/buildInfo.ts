// Build info - injected at build time by Vite
declare const __BUILD_TIMESTAMP__: string;
declare const __BUILD_DATE__: string;

export const BUILD_INFO = {
  timestamp: parseInt(__BUILD_TIMESTAMP__),
  date: __BUILD_DATE__,
};
