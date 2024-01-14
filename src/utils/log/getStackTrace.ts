export function getStackTrace(): string[] {
  try {
    throw new Error()
  } catch (error) {
    if (error instanceof Error) {
      return (error.stack ?? "").split("\n").slice(1)
    }
    return []
  }
}
