export const getCollaborationSocketUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/(^["']|["']$)/g, "")
  return raw || "http://localhost:4000"
}
