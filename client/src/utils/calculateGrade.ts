import { Assignment } from "../types/Course";

export const calculateFinalGrade = (assignments: Assignment[]) => {
  let finalGrade = 0;
  assignments.forEach(
    (assignment) =>
      (finalGrade += assignment.grade * 0.01 * assignment.worth * 0.01)
  );
  return finalGrade;
};

export const calculateProjectedGrade = (assignments: Assignment[]) => {
  let projectedGrade = 0;
  let totalProjectedWorth = 0;
  assignments.forEach((assignment) => {
    projectedGrade += assignment.grade * 0.01 * assignment.worth * 0.01;
    if (assignment.grade !== 0) {
      totalProjectedWorth += assignment.worth * 0.01;
    }
  });
  return totalProjectedWorth === 0 ? 0 : projectedGrade / totalProjectedWorth;
};
