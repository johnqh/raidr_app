/**
 * @fileoverview App constants derived from VITE_* environment variables.
 */
import packageJson from '../../package.json';

/** Read once at import; unset VITE_* values fall back to production defaults. */
export const CONSTANTS = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'raidr',
  APP_DOMAIN: import.meta.env.VITE_APP_DOMAIN || 'raidr.app',
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || 'Sudobility',
  APP_VERSION: packageJson.version,
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || 'support@raidr.app',
  /** raidr_api base; also the host of every MCP endpoint. */
  API_URL: (import.meta.env.VITE_API_URL || 'https://api.raidr.app').replace(/\/+$/, ''),
  /** Where the playground sends people to install the raidr browser extension. */
  EXTENSION_URL:
    import.meta.env.VITE_EXTENSION_URL || 'https://github.com/johnqh/raidr_extension#install',
} as const;
