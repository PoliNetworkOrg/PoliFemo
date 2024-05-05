/** module name to be excluded from file search to prevent download of junk */
export const EXCLUDED_MODNAMES = [
  "page",
  "forum",
  "url",
  "wooclap",
  "choice",
  "feedback",
  "label",
  "lesson",
]

export interface Course {
  id: number
  fullname: string
  name: string
  shouldSync: boolean
}

export interface FileInfo {
  coursename: string
  filename: string
  filepath: string
  filesize: number
  fileurl: string
  timecreated: number
  timemodified: number
  updating?: boolean // set to true if the file is already downloaded, and is being updated
}

export type Contents = {
  id: number
  name: string
  modules: {
    id: number
    name: string
    modname: string
    contents?: ({
      type: string
    } & FileInfo)[]
  }[]
}[]

// For doing the UI

export interface MockCourse {
  id: number
  fullname: string
  name: string
  folder: MockFolder
  image?: string
}

export interface MockFolder {
  name: string
  fullpath: string
  folders: MockFolder[]
  files: MockFile[]
}

export interface MockFile {
  downloadUrl: string
  fullpath: string
  name: string
}

export const mockCourses: MockCourse[] = [
  {
    id: 1,
    fullname: "Course 1",
    name: "Course 1",
    image:
      "https://images.unsplash.com/photo-1714828099313-682019f11374?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    folder: {
      name: "",
      fullpath: "/",
      folders: [
        {
          name: "esercitazioni",
          fullpath: "/esercitazioni",
          folders: [],
          files: [
            {
              downloadUrl: "https://www.google.com",
              fullpath: "/esercitazioni/file1",
              name: "file1",
            },
          ],
        },
        {
          name: "lezioni",
          fullpath: "/lezioni",
          folders: [],
          files: [
            {
              downloadUrl: "https://www.google.com",
              fullpath: "/lezioni/file1",
              name: "file1",
            },
          ],
        },
      ],
      files: [
        {
          downloadUrl: "https://www.google.com",
          fullpath: "/file1",
          name: "file1",
        },
      ],
    },
  },
  {
    id: 2,
    fullname: "Course 2",
    name: "Course 2",
    image:
      "https://images.unsplash.com/photo-1714828099313-682019f11374?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    folder: {
      name: "",
      fullpath: "/",
      folders: [
        {
          name: "lezioni",
          fullpath: "/lezioni",
          folders: [],
          files: [
            {
              downloadUrl: "https://www.google.com",
              fullpath: "/lezioni/file1",
              name: "file1",
            },
          ],
        },
      ],
      files: [
        {
          downloadUrl: "https://www.google.com",
          fullpath: "/file2",
          name: "file2",
        },
      ],
    },
  },
  {
    id: 3,
    fullname: "Course 3",
    name: "Course 3",
    image:
      "https://images.unsplash.com/photo-1714828099313-682019f11374?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    folder: {
      name: "",
      fullpath: "/",
      folders: [],
      files: [
        {
          downloadUrl: "https://www.google.com",
          fullpath: "/file3",
          name: "file3",
        },
      ],
    },
  },
  {
    id: 4,
    fullname: "Course 4",
    name: "Course 4",
    image:
      "https://images.unsplash.com/photo-1714828099313-682019f11374?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    folder: {
      name: "",
      fullpath: "/",
      folders: [],
      files: [
        {
          downloadUrl: "https://www.google.com",
          fullpath: "/file4",
          name: "file4",
        },
      ],
    },
  },
  {
    id: 5,
    fullname: "Course 5",
    name: "Course 5",
    image:
      "https://images.unsplash.com/photo-1714828099313-682019f11374?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    folder: {
      name: "",
      fullpath: "/",
      folders: [],
      files: [
        {
          downloadUrl: "https://www.google.com",
          fullpath: "/file5",
          name: "file5",
        },
      ],
    },
  },
  {
    id: 6,
    fullname: "Course 6",
    name: "Course 6",
    image:
      "https://images.unsplash.com/photo-1714828099313-682019f11374?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    folder: {
      name: "",
      fullpath: "/",
      folders: [],
      files: [
        {
          downloadUrl: "https://www.google.com",
          fullpath: "/file6",
          name: "file6",
        },
      ],
    },
  },
]
