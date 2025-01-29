import { useContext, useState } from "react";
import styled from "styled-components";
import { fetchApi } from "../../utils/fetchApi";
import { AuthContext, useAuth } from "../Auth/AuthProvider";

const ChangeEmailForm = styled.form`
  display: flex;
  gap: 5px;
  align-items: center;
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

const ChangeEmail = () => {
  const { refreshAuth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetchApi("/auth/change-email", "POST", { email });
      await refreshAuth();
      setMessage("Successfully updated email.");
    } catch (error) {
      setMessage("An error occured updating your email.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <ChangeEmailForm onSubmit={handleSubmit}>
        <label>
          New email: &nbsp;
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <SubmitButton type="submit" disabled={isSubmitting}>
          Change
        </SubmitButton>
      </ChangeEmailForm>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangeEmail;
