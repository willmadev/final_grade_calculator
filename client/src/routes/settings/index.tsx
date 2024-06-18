import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import styled from "styled-components";
import { FaXmark } from "react-icons/fa6";
import ChangeEmail from "../../Components/settings/ChangeEmail";
import ChangePassword from "../../Components/settings/ChangePassword";
import { useAuth } from "../../Components/Auth/AuthProvider";

const SettingsContainer = styled.div`
  background-color: white;
  height: max-content;
  padding: 40px 45px 100px;
  border-radius: 20px;
  box-shadow: 4px 4px 15px rgba(80, 80, 80, 0.15);
  width: 650px;
  max-width: 90%;
  height: 80%;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled(FaXmark)`
  font-size: 30px;
  &:hover {
    color: #888;
    cursor: pointer;
  }
`;
const Section = styled.div``;

const Divider = styled.hr`
  margin: 10px 0px;
  border: 1px #888 solid;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingItemHeading = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
`;

const SettingItemCaption = styled.p`
  font-size: 0.8rem;
`;

const SettingItemAction = styled.button`
  font-size: 1rem;
  height: min-content;
  padding: 6px 12px;
  border: none;
  border-radius: 10px;
  background-color: #d9d9d9;

  &:hover {
    cursor: pointer;
    background-color: #888;
  }
`;

const Settings = () => {
  const navigate = useNavigate({ from: "/settings" });
  const auth = useAuth();

  const [changeEmailActive, setChangeEmailActive] = useState(false);
  const [changePasswordActive, setChangePasswordActive] = useState(false);

  const handleCloseSettings = (e: React.MouseEvent) => {
    navigate({ to: "/course" });
  };
  const handleChangeEmail = (e: React.MouseEvent) => {
    setChangeEmailActive(true);
  };
  const handleChangePassword = (e: React.MouseEvent) => {
    setChangePasswordActive(true);
  };
  return (
    <SettingsContainer>
      <SettingsHeader>
        <h1>Settings</h1>
        <CloseButton onClick={handleCloseSettings} />
      </SettingsHeader>
      <Section>
        <h2>Profile</h2>
        <Divider />
        <SectionContent>
          <SettingItem>
            <div>
              <SettingItemHeading>Email</SettingItemHeading>
              <SettingItemCaption>
                {auth.isAuthenticated && auth.email}
              </SettingItemCaption>
            </div>
            <SettingItemAction onClick={handleChangeEmail}>
              Change Email
            </SettingItemAction>
          </SettingItem>
          {changeEmailActive && <ChangeEmail />}
          <SettingItem>
            <SettingItemHeading>Password</SettingItemHeading>
            <SettingItemAction onClick={handleChangePassword}>
              Change Password
            </SettingItemAction>
          </SettingItem>
          {changePasswordActive && <ChangePassword />}
        </SectionContent>
      </Section>
    </SettingsContainer>
  );
};

export const Route = createFileRoute("/settings/")({
  component: () => <Settings />,
});
