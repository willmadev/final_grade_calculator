export type Assignment = {
  id: number;
  name: string;
  worth: number;
  grade: number;
};

export type Course = {
  id: number;
  name: string;
  assignments: Assignment[];
};
