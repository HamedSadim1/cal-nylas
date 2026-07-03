import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",

  // The DATABASE_URL moved out of `datasource db { url }` in Prisma 7.
  // `env()` is a typed helper that resolves process.env at config-load time.
  datasource: {
    url: env("DATABASE_URL"),
  },
});
