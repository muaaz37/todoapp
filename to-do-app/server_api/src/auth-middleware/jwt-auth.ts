import { expressjwt } from "express-jwt";
import fs from "fs";
import path from "path";

const publicKeyPath = path.join("/app/keys/public-key.pem");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

export const jwtAuth = expressjwt({
  secret: publicKey,
  algorithms: ["RS256"],
  requestProperty: "auth",
  getToken: (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }
    return undefined;
  },
});
