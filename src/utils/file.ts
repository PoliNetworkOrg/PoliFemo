import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"

export async function exportAndShareFile(
  content: string,
  url: string,
  dialogTitle: string
) {
  // eslint-disable-next-line @typescript-eslint/naming-convention

  const uri = FileSystem.cacheDirectory + url
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await FileSystem.writeAsStringAsync(uri, content)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  await Sharing.shareAsync(uri, { dialogTitle: dialogTitle })
}
