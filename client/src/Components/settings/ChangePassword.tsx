import React, { useState } from "react";
import styled from "styled-components";
import { fetchApi } from "../../utils/fetchApi";

const ChangePasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 5px;
  width: 400px;
`;

const PasswordInputs = styled.div`
  display: grid;
  grid-template-columns: 200px 200px;
  row-gap: 3px;
`;

const SubmitButton = styled.button`
  font-size: 1rem;
  height: min-content;
  padding: 3px 8px;
  border: 1px solid #888;
  border-radius: 5px;
  background-color: #efefef;

  &:hover {
    background-color: #b4b4b4;
    cursor: pointer;
  }
`;

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== repeatPassword) {
      setMessage("Passwords must match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetchApi("/auth/change-password", "POST", {
        password: currentPassword,
        newPassword,
      });
      setMessage("Password successfully changed.");
    } catch (error) {
      setMessage("An error occured changing your password.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <ChangePasswordForm onSubmit={handleSubmit}>
        <PasswordInputs>
          <label htmlFor="currentPassword">Current Password: </label>
          <input
            name="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label htmlFor="newPassword">New Password:</label>
          <input
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="repeatPassword">Repeat New Password:</label>
          <input
            name="repeatPassword"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </PasswordInputs>
        <SubmitButton type="submit" disabled={isSubmitting}>
          Change
        </SubmitButton>
      </ChangePasswordForm>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
