import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginStart, loginSuccess, loginFailure } from "../../slices/authSlice";
import { authService } from "../../services/authService";
import { APP_ROUTES } from "../../constants/routes";

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await authService.login(formData);
      dispatch(loginSuccess(response));
      navigate(APP_ROUTES.CHAT);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Login
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <FormField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Enter your username"
        required
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full mb-4">
        Login
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a
          href={APP_ROUTES.REGISTER}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Register
        </a>
      </p>
    </form>
  );
};
