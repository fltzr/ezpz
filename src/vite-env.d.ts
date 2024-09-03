/// <reference types="vite/client" />

declare module '*.scss' {
  const classes: { [key?: string]: string };
  export default classes;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
