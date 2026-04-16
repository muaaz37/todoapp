import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const examplePath = path.join(projectRoot, ".env.example");
const envPath = path.join(projectRoot, ".env");

if (!fs.existsSync(examplePath)) {
  console.error("Missing .env.example. Cannot create .env.");
  process.exit(1);
}

if (fs.existsSync(envPath)) {
  console.log(".env already exists. Keeping existing file.");
  process.exit(0);
}

try {
  fs.copyFileSync(examplePath, envPath, fs.constants.COPYFILE_EXCL);
  console.log("Created .env from .env.example.");
  console.log("Review and update credentials in .env before first run.");
} catch (error) {
  console.error("Failed to create .env:", error.message);
  process.exit(1);
}
