import React from "react";
import { RegisterForm } from "../components/organisms/RegisterForm";

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
      <RegisterForm />
    </div>
  );
};
