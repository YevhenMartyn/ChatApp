import React from "react";
import { RegisterForm } from "../components/organisms/RegisterForm";

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <RegisterForm />
    </div>
  );
};
