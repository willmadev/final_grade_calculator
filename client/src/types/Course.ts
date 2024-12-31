export type Assignment = {
  id: number;
  courseId: number;
  name: string;
  worth: number;
  grade: number;
};

export type Course = {
  id: number;
  name: string;
  assignments: Assignment[];
  archived: boolean;
};

export type ArchivedCourse = {
  id: number;
  name: string;
  archived: boolean;
  archivedAt: string;
};
