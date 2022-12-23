import { FC } from "react";

interface AssignmentRowProps {
  assignmentName: string;
  worth: number;
  grade: number;
}

const AssignmentRow: FC<AssignmentRowProps> = ({
  assignmentName,
  grade,
  worth,
}) => {
  return (
    <tr>
      <td>{assignmentName}</td>
      <td>{worth}</td>
      <td>{grade}</td>
    </tr>
  );
};

export default AssignmentRow;
