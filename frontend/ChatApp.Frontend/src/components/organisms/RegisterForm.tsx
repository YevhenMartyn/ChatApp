import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../slices/authSlice";
import { authService } from "../../services/authService";
import { APP_ROUTES } from "../../constants/routes";

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    dispatch(registerStart());

    try {
      const { username, password } = formData;
      const response = await authService.register({
        username,
        password,
      });
      dispatch(registerSuccess(response));
      navigate(APP_ROUTES.CHAT);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      dispatch(registerFailure(errorMessage));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Register
      </h2>

      {(error || validationError) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error || validationError}
        </div>
      )}

      <FormField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Choose a username"
        required
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a password"
        required
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full mb-4">
        Register
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href={APP_ROUTES.LOGIN}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Login
        </a>
      </p>
    </form>
  );
};
