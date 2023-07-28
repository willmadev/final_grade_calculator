import { Assignment } from "../types/Assignment";

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
      console.log({
        grade: assignment.grade,
        worth: assignment.worth,
      });
      totalProjectedWorth += assignment.worth * 0.01;
    }
  });
  console.log({ projectedGrade, totalProjectedWorth });
  return projectedGrade / totalProjectedWorth;
};
