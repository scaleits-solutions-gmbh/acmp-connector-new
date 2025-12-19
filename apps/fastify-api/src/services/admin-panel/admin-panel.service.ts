import path from "node:path";
import { existsSync } from "node:fs";
import fastifyStatic from "@fastify/static";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  EMBEDDED_FILES,
  getEmbeddedFile,
  getFileContent,
} from "./embedded-files";

/**
 * Determines if we should use embedded files or serve from disk.
 * Uses embedded files when:
 * 1. Running as a compiled binary (no admin-panel/dist folder available)
 * 2. Embedded files exist and disk folder doesn't
 */
function shouldUseEmbeddedFiles(): boolean {
  const diskPath = path.resolve(process.cwd(), "../admin-panel/dist");
  const diskExists = existsSync(diskPath);
  const hasEmbeddedFiles = Object.keys(EMBEDDED_FILES).length > 0;

  // Prefer disk in development, embedded in production/bundled
  if (!diskExists && hasEmbeddedFiles) {
    return true;
  }

  // Check if running as compiled binary (executable path doesn't contain node/bun dev paths)
  const execPath = process.execPath.toLowerCase();
  const isCompiled =
    !execPath.includes("node") &&
    !execPath.includes("bun") &&
    !execPath.includes(".bin");

  return isCompiled && hasEmbeddedFiles;
}

/**
 * Service to serve the Admin Panel static React application.
 *
 * Supports two modes:
 * 1. Development: Serves files from disk using @fastify/static
 * 2. Production/Bundled: Serves embedded files from memory
 */
export async function adminPanelService(fastify: FastifyInstance) {
  const useEmbedded = shouldUseEmbeddedFiles();

  if (useEmbedded) {
    // ─────────────────────────────────────────────────────────────────────────────
    // EMBEDDED MODE: Serve files from memory (for bundled executables)
    // ─────────────────────────────────────────────────────────────────────────────
    fastify.log.info("Admin panel: Serving embedded files from memory");

    fastify.get("/*", async (request: FastifyRequest, reply: FastifyReply) => {
      // Get path relative to the prefix (/admin-panel)
      const urlPath = request.url.replace(/^\/admin-panel/, "") || "/";

      // Try to find the file
      let file = getEmbeddedFile(urlPath);

      // SPA fallback: serve index.html for non-asset routes
      if (!file && !urlPath.includes(".")) {
        file = getEmbeddedFile("/index.html");
      }

      if (!file) {
        return reply.code(404).send({ error: "Not found" });
      }

      const content = getFileContent(file);
      return reply.type(file.type).send(content);
    });

    // Handle root path
    fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
      const file = getEmbeddedFile("/index.html");
      if (!file) {
        return reply.code(404).send({ error: "Admin panel not found" });
      }
      const content = getFileContent(file);
      return reply.type(file.type).send(content);
    });
  } else {
    // ─────────────────────────────────────────────────────────────────────────────
    // DISK MODE: Serve files from file system (for development)
    // ─────────────────────────────────────────────────────────────────────────────
    const distPath = path.resolve(process.cwd(), "../admin-panel/dist");
    fastify.log.info(`Admin panel: Serving static files from ${distPath}`);

    // Register static plugin
    await fastify.register(fastifyStatic, {
      root: distPath,
      prefix: "/",
      wildcard: true,
    });

    // Handle SPA routing: serve index.html for any route not found in static files
    fastify.setNotFoundHandler((_request, reply) => {
      return reply.sendFile("index.html");
    });
  }
}
