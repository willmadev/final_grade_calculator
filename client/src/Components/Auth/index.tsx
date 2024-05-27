import { useContext, useState } from "react";
import styled from "styled-components";

import { baseUrl } from "../../utils/config";
import { AuthContext } from "./AuthProvider";

const Heading = styled.h2`
  font-size: 2rem;
`;
const AuthContainer = styled.div`
  background-color: white;
  height: max-content;
  padding: 40px 45px 100px;
  border-radius: 20px;
  box-shadow: 4px 4px 15px rgba(80, 80, 80, 0.15);
  width: 450px;
  max-width: 90%;
  height: 60%;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormField = styled.label`
  display: flex;
  font-weight: 600;
  flex-direction: column;
  gap: 5px;

  & input {
    font-size: 1.2rem;
    padding: 5px 10px;
    border-radius: 5px;
    border: solid 1px black;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.8rem;
  color: red;
`;

const SubmitButton = styled.input`
  align-self: center;
  width: max-content;
  background: #a9b7ff;
  padding: 10px 20px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;

  &:hover {
    cursor: pointer;
    background-color: #6a7ee0;
  }
`;

const Link = styled.a`
  width: max-content;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
    color: purple;
  }
`;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const { setAuth } = useContext(AuthContext);

  const toggleAuthType = () => {
    setIsLogin((curr) => !curr);
    setFormValues({ email: "", password: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((curr) => ({ ...curr, [e.target.name]: e.target.value }));
    console.log(formValues);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    // validation
    if (formValues.email.match(/^[\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/) === null) {
      setErrorMessage("Invalid email");
      return;
    } else if (formValues.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (isLogin) {
      const res = await fetch(`${baseUrl}/auth/login`, {
        body: JSON.stringify(formValues),
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) {
        if (res.status === 400) {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("An error occured");
        }
        setFormValues((curr) => ({ ...curr, password: "" }));
        return;
      }
      setAuth({ isLoggedIn: true, email: formValues.email });
    } else {
      const res = await fetch(`${baseUrl}/auth/register`, {
        body: JSON.stringify(formValues),
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) {
        if (res.status === 400) {
          setErrorMessage("An account already exists with this email.");
        } else {
          setErrorMessage("An error occured");
        }
        setFormValues((curr) => ({ ...curr, password: "" }));
        return;
      }
      setAuth({ isLoggedIn: true, email: formValues.email });
    }
  };
  return (
    <AuthContainer>
      <Heading>{isLogin ? "Log In" : "Sign Up"}</Heading>
      <Form onSubmit={handleSubmit}>
        <FormField htmlFor="email">
          Email
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={formValues.email}
          />
        </FormField>
        <FormField htmlFor="password">
          Password
          <input
            name="password"
            type="password"
            onChange={handleChange}
            value={formValues.password}
          />
        </FormField>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <SubmitButton type="submit" value={isLogin ? "Log In" : "Sign Up"} />
      </Form>
      <Link onClick={toggleAuthType}>
        {isLogin ? "Already have an account?" : "Don't have an account?"}
      </Link>
    </AuthContainer>
  );
};

export default Auth;
