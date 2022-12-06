import React, { useEffect, useState } from "react";
import { Assignment } from "../../types/Assignment";

interface EditRowProps {
  assignment: Assignment;
  setAssignment: (assignment: Assignment) => void;
  deleteAssignment: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditRow = ({
  assignment,
  setAssignment,
  deleteAssignment,
  setIsEditing,
}: EditRowProps) => {
  const [inputs, setInputs] = useState(assignment);

  return (
    <tr className="calculator-edit-row">
      <td>
        <input
          type={"text"}
          value={inputs.assignment}
          onChange={(e) => setInputs({ ...inputs, assignment: e.target.value })}
        />
      </td>
      <td>
        <input
          type={"number"}
          value={inputs.worth}
          onChange={(e) =>
            setInputs({ ...inputs, worth: parseFloat(e.target.value) })
          }
        />
      </td>
      <td>
        <input
          type={"number"}
          value={inputs.grade}
          onChange={(e) =>
            setInputs({ ...inputs, grade: parseFloat(e.target.value) })
          }
        />
        <input
          type={"submit"}
          value="Done"
          onClick={(e) => {
            setAssignment(inputs);
            setIsEditing(false);
          }}
        />
        <input
          type={"button"}
          value="Cancel"
          onClick={(e) => setIsEditing(false)}
        />
        <input
          type={"button"}
          value="Delete"
          onClick={(e) => deleteAssignment()}
        />
      </td>
    </tr>
  );
};

interface ViewRowProps {
  assignment: Assignment;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewRow = ({ assignment, setIsEditing }: ViewRowProps) => {
  return (
    <tr className="calculator-row" onClick={() => setIsEditing(true)}>
      <td>{assignment.assignment}</td>
      <td>{assignment.worth}%</td>
      <td>{assignment.grade}%</td>
    </tr>
  );
};

interface RowProps {
  assignment: Assignment;
  setAssignment: (assignment: Assignment) => void;
  deleteAssignment: () => void;
}

const Row = ({ assignment, setAssignment, deleteAssignment }: RowProps) => {
  const [isEditing, setIsEditing] = useState(true);

  return isEditing ? (
    <EditRow
      assignment={assignment}
      setAssignment={setAssignment}
      setIsEditing={setIsEditing}
      deleteAssignment={deleteAssignment}
    />
  ) : (
    <ViewRow assignment={assignment} setIsEditing={setIsEditing} />
  );
};

export default Row;
