export type Assignment = {
  id: string;
  courseId: string;
  name: string;
  worth: number;
  grade: number;
};

export type Course = {
  id: string;
  name: string;
  assignments: Assignment[];
  archived: boolean;
};

export type ArchivedCourse = {
  id: string;
  name: string;
  archived: boolean;
  archivedAt: string;
};
