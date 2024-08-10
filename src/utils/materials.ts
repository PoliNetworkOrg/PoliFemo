import { MockFolder } from "api/moodle"

export const isFolderInArray = (
  folder: MockFolder,
  array: MockFolder[],
): boolean => {
  return array.some(f => f.fullpath === folder.fullpath)
}
