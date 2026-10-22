import type { NextConfig } from "next";

const config: NextConfig = {
  serverExternalPackages: ["@libsql/client", "postgres"],
  poweredByHeader: false,
};
export default config;
