import "dotenv/config";
import { bootstrapApp } from "@/bootstrap";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function main() {
  const app = await bootstrapApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`🚀 Fastify Web Server running`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
