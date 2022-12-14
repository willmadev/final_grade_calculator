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
};
