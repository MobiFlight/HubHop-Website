import path from "path"

export const AUTH_DIR = path.join(__dirname, "..", ".auth")

/** Storage states created by `tests/auth.setup.ts` */
export const authFile = {
  anonymous: path.join(AUTH_DIR, "anonymous.json"),
  user: path.join(AUTH_DIR, "user.json"),
  moderator: path.join(AUTH_DIR, "moderator.json"),
}

export const testUser = {
  name: "Test User",
  username: "test.user@example.com",
}
