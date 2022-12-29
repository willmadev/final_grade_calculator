import { Assignment } from "../types/Assignment";

export const calculateFinalGrade = (assignments: Assignment[]) => {
  let finalGrade = 0;
  assignments.forEach(
    (assignment) =>
      (finalGrade += assignment.grade * 0.01 * assignment.worth * 0.01)
  );
  return finalGrade;
};
