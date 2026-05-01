import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT || 4000);
const host = process.env.HOST || "0.0.0.0";

console.log("Server entrypoint loaded");
console.log("Using host", host, "port", port);

const server = app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
