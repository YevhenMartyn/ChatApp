import React from "react";
import { LoginForm } from "../components/organisms/LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
      <LoginForm />
    </div>
  );
};
