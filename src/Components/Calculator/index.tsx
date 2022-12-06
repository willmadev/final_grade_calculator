import React, { useMemo, useState } from "react";
import { Assignment } from "../../types/Assignment";
import Row from "./Row";

const Calculator = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const setAssignment = (assignment: Assignment, i: number) => {
    setAssignments(
      assignments.map((val, index) => {
        if (index === i) {
          return assignment;
        }
        return val;
      })
    );
  };

  const deleteAssignment = (i: number) => {
    setAssignments(assignments.filter((_, index) => index !== i));
  };

  const addAssignmentCallback = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAssignments([...assignments, { assignment: "", worth: 0, grade: 0 }]);
    console.log("assignments", assignments);
  };

  const getOverallGrade = useMemo(() => {
    if (assignments.length === 0) {
      return null;
    }
    const grades = assignments.map((val) => (val.grade * val.worth) / 100);
    return grades.reduce((accumulator, current) => accumulator + current);
  }, [assignments]);

  return (
    <div>
      <table className="calculator">
        <tr className="calculator-header">
          <th>Assignment</th>
          <th>Worth</th>
          <th>Grade Achieved</th>
        </tr>
        {assignments.map((assignment, i) => {
          const setAssignmentIndexed = (assignment: Assignment) =>
            setAssignment(assignment, i);

          const deleteAssignmentIndexed = () => deleteAssignment(i);
          return (
            <Row
              assignment={assignment}
              setAssignment={setAssignmentIndexed}
              deleteAssignment={deleteAssignmentIndexed}
              key={i}
            />
          );
        })}
        <tr>
          <th colSpan={2}>Overall Grade:</th>
          <th>{getOverallGrade}%</th>
        </tr>
      </table>
      <button onClick={addAssignmentCallback}>Add Assignment</button>
    </div>
  );
};

export default Calculator;
