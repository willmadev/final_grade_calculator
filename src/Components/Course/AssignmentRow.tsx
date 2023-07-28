import React, { FC, useContext, useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { Assignment } from "../../types/Assignment";
import { MenuItem } from "../../types/Menu";
import { ContextMenuContext } from "../ContextMenu/ContextMenuProvider";

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: auto 80px 80px 40px;
  margin: 0px -10px;
  padding: 0px 10px;
  border-radius: 5px;
  &:hover {
    background-color: #bdc4ca;
    cursor: pointer;
  }
  & p {
    margin: 5px 0px;
  }
`;
interface AssignmentRowRegularProps {
  assignment: Assignment;
  onClick?: React.MouseEventHandler;
  onContextMenu?: React.MouseEventHandler;
}

const AssignmentRowRegular: FC<AssignmentRowRegularProps> = ({
  assignment,
  onClick,
  onContextMenu,
}) => {
  return (
    <StyledRow onClick={onClick} onContextMenu={onContextMenu}>
      <p>{assignment.name}</p>
      <p>{assignment.worth}%</p>
      <p>{assignment.grade}%</p>
    </StyledRow>
  );
};

const StyledEditRow = styled.form`
  display: grid;
  grid-template-columns: auto 80px 80px 40px;
`;

const ButtonsContainer = styled.div`
  /* position: absolute;
  right: 0px;
  bottom: 5px; */
  display: flex;
  gap: 3px;
`;

const ButtonWrapper = styled.button`
  /* width: 35px;
  height: 35px; */

  &:hover {
    cursor: pointer;
  }
`;

const StyledInput = styled.input`
  /* padding: 0px; */
  margin: 0px;
  width: calc(100% - 10px);
  height: min-content;
  border: none;
  border-bottom: 2px solid black;
  background-color: rgba(0, 0, 0, 0);
  font-size: 1rem;
  margin: 5px 0px;
  &:focus {
    outline: none;
  }
`;

type EditAssignment = {
  id: number;
  courseId: number;
  name: string;
  worth: string;
  grade: string;
};

interface AssignmentRowEditProps extends AssignmentRowRegularProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  updateAssignment: (assignment: Assignment) => void;
}

const AssignmentRowEdit: FC<AssignmentRowEditProps> = ({
  assignment,
  setIsEditing,
  updateAssignment,
  onContextMenu,
}) => {
  const [inputAssignment, setInputAssignment] = useState<EditAssignment>({
    ...assignment,
    worth: assignment.worth.toString(),
    grade: assignment.grade.toString(),
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAssignment((currentInput) => {
      return {
        ...currentInput,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateAssignment({
      ...inputAssignment,
      grade: isNaN(parseFloat(inputAssignment.grade))
        ? 0
        : parseFloat(inputAssignment.grade),
      worth: isNaN(parseFloat(inputAssignment.worth))
        ? 0
        : parseFloat(inputAssignment.worth),
    });
    setIsEditing(false);
  };
  const handleCancel = (e: React.MouseEvent) => {
    setIsEditing(false);
  };
  return (
    <StyledEditRow
      onSubmit={handleSubmit}
      autoComplete="off"
      onContextMenu={onContextMenu}
    >
      <StyledInput
        onChange={handleChange}
        name="name"
        value={inputAssignment.name}
        autoFocus
      />
      <StyledInput
        onChange={handleChange}
        type="number"
        step="any"
        name="worth"
        value={inputAssignment.worth}
      />
      <StyledInput
        onChange={handleChange}
        type="number"
        step="any"
        name="grade"
        value={inputAssignment.grade}
      />
      <ButtonsContainer>
        <ButtonWrapper type="submit">
          <FaCheck />
        </ButtonWrapper>
        <ButtonWrapper type="button" onClick={handleCancel}>
          <FaTimes />
        </ButtonWrapper>
      </ButtonsContainer>
    </StyledEditRow>
  );
};

interface AssignmentRowProps {
  assignment: Assignment;
  updateAssignment: (assignment: Assignment) => void;
  removeAssignment: (courseId: number, assignmentId: number) => void;
}

const AssignmentRow: FC<AssignmentRowProps> = ({
  assignment,
  updateAssignment,
  removeAssignment,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // default to not editing when course id changed
  useEffect(() => {
    setIsEditing(false);
  }, [assignment.courseId]);

  const { setContextMenu } = useContext(ContextMenuContext);
  const menuItems: MenuItem[] = [
    {
      text: "Delete Assignment",
      onClick() {
        removeAssignment(assignment.courseId, assignment.id);
      },
    },
  ];

  return (
    <>
      {isEditing ? (
        <AssignmentRowEdit
          assignment={assignment}
          setIsEditing={setIsEditing}
          updateAssignment={updateAssignment}
          onContextMenu={(e) => setContextMenu(e, menuItems)}
        />
      ) : (
        <AssignmentRowRegular
          assignment={assignment}
          onClick={() => setIsEditing(true)}
          onContextMenu={(e) => setContextMenu(e, menuItems)}
        />
      )}
    </>
  );
};

export default AssignmentRow;
