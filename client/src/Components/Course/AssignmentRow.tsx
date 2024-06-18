import React, { FC, useContext, useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ContextMenuContext } from "../ContextMenu/ContextMenuProvider";
import { Assignment } from "../../types/Course";
import { MenuItem } from "../../types/Menu";
import { deleteAssignment, updateAssignment } from "../../api/course";

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
}

const AssignmentRowEdit: FC<AssignmentRowEditProps> = ({
  assignment,
  setIsEditing,
  onContextMenu,
}) => {
  const [inputAssignment, setInputAssignment] = useState<EditAssignment>({
    ...assignment,
    worth: assignment.worth.toString(),
    grade: assignment.grade.toString(),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateAssignment,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`course/${assignment.courseId}/assignment`],
      }),
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
    mutation.mutate({
      courseId: assignment.courseId,
      assignment: {
        ...inputAssignment,
        grade: isNaN(parseFloat(inputAssignment.grade))
          ? 0
          : parseFloat(inputAssignment.grade),
        worth: isNaN(parseFloat(inputAssignment.worth))
          ? 0
          : parseFloat(inputAssignment.worth),
      },
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
}

const AssignmentRow: FC<AssignmentRowProps> = ({ assignment }) => {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`course/${assignment.courseId}/assignment`],
      });
    },
  });

  // default to not editing when course id changed
  useEffect(() => {
    setIsEditing(false);
  }, [assignment.courseId]);

  const { setContextMenu } = useContext(ContextMenuContext);
  const menuItems: MenuItem[] = [
    {
      text: "Delete Assignment",
      onClick() {
        deleteMutation.mutate({
          courseId: assignment.courseId,
          assignmentId: assignment.id,
        });
      },
    },
  ];

  return (
    <>
      {isEditing ? (
        <AssignmentRowEdit
          assignment={assignment}
          setIsEditing={setIsEditing}
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
