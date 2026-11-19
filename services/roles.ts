/**
 * Roles of the logged-in user, loaded by getUserSettings() ("Guest" when
 * logged out). Only a hint for the UI: the API enforces permissions.
 */
export const isModerator = () =>
  typeof window !== "undefined" &&
  !!localStorage.getItem("roles")?.toLowerCase().includes("moderator")
