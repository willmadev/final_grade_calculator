import React, { FC, useContext, useState } from "react";
import styled from "styled-components";
import { FaCheck, FaTimes } from "react-icons/fa";

import courseContext from "./courseContext";
import { Course } from "../../types/Assignment";

const StyledTitleEditor = styled.form`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const TitleInput = styled.input`
  margin: 0px -10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.8rem;
  font-weight: bolder;
  width: 100%;
  border: none;
  border-bottom: 2px solid black;
  border-radius: 0px;
  background-color: rgba(0, 0, 0, 0);
  &:focus {
    outline: none;
  }
`;

const ButtonsContainer = styled.div`
  position: absolute;
  right: 0px;
  bottom: 5px;
  display: flex;
  gap: 5px;
`;

const ButtonWrapper = styled.button`
  width: 35px;
  height: 35px;

  &:hover {
    cursor: pointer;
  }
`;

interface CourseTitleEditorProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  updateCourse: (courseId: number, course: Course) => void;
}

const CourseTitleEditor: FC<CourseTitleEditorProps> = ({
  setIsEditing,
  updateCourse,
}) => {
  const course = useContext(courseContext);
  const [title, setTitle] = useState(course.name);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateCourse(course.id, { ...course, name: title });
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsEditing(false);
  };
  return (
    <StyledTitleEditor onSubmit={handleSubmit}>
      <TitleInput
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ButtonsContainer>
        <ButtonWrapper type="submit">
          <FaCheck />
        </ButtonWrapper>
        <ButtonWrapper type="button" onClick={handleCancel}>
          <FaTimes />
        </ButtonWrapper>
      </ButtonsContainer>
    </StyledTitleEditor>
  );
};

export default CourseTitleEditor;
