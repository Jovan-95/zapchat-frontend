/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm } from "react-hook-form";
import { LoginFormUser } from "../../types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addLoggedUser } from "../../redux/slice";
import { showErrorToast, showSuccessToast } from "../../components/toast";
import { useState } from "react";
import { FetchError } from "../../types/interfaces";
// import { pusher } from "../../pusherClient";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormUser>();

  // HTTP POST, BE vraca Usera
  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data && data.status) {
        // Dispatch u Redux
        dispatch(
          addLoggedUser({
            ...data.data,
            auth_token: data.auth_token, // auth_token iz response
          })
        );

        // Navigacija na home
        showSuccessToast("Login is successfull!");
        navigate("/");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (error: FetchError) => {
      // Pretpostavljamo da je status 422 za pogrešan email/lozinku
      if (error?.status === 422) {
        setServerError("Invalid email or password.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
      showErrorToast("Login failed!");
    },
  });

  function onSubmit(data: LoginFormUser) {
    // console.log("Form data:", data);
    setServerError("");
    loginUserMutation.mutate(data);
  }

  return (
    <div className="auth-wrapper">
      <div className="bg-img-wrapper">
        {" "}
        <img src="/images/auth-bg.png" alt="logo" />
      </div>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="logo">
            {" "}
            <img src="/icons/zc-logo.png" alt="logo" />
          </div>
          <div className="form-heading">Login to Zapchat</div>
          <div className="form-underheading">
            Welcome back! Please enter your details.
          </div>

          <div className="input-wrapper">
            <label>Email</label>
            <div className="icon-input-wrapper">
              <img src="/icons/email-icon.png" alt="icon" />
              <input
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Enter a valid email",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>
          <div className="input-wrapper">
            <label>Password</label>
            <div className="icon-input-wrapper">
              <img src="/icons/password-icon.png" alt="icon" />
              <input
                placeholder="Enter your password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Min 8 characters",
                  },
                })}
              />
            </div>
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
            {serverError && <p className="error-text">{serverError}</p>}
          </div>

          <div onClick={() => navigate("/register")} className="form-link-text">
            Create account?
          </div>
          <div
            onClick={() => navigate("/forgot-password")}
            className="form-link-text"
          >
            Forgot password?
          </div>
          <div>
            <button type="submit" className="btn-primary">
              <span>Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
