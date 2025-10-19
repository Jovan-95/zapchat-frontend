import { useForm } from "react-hook-form";
import { RegisterFormUser } from "../../types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerNewUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../components/toast";

function Register() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormUser>();

  // HTTP POST
  const addUserMutation = useMutation({
    mutationFn: registerNewUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["register"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      showSuccessToast("Registration success!");
    },
    onError: () => {
      showErrorToast("Registration failed!");
    },
  });

  function onSubmit(data: RegisterFormUser) {
    console.log("Form data:", data);
    // ovde šalješ podatke na backend ili API

    addUserMutation.mutate(data);
    navigate("/login");
  }

  const password = watch("password");

  return (
    <div className="auth-wrapper">
      <div className="bg-img-wrapper">
        <img src="/images/auth-bg.png" alt="logo" />
      </div>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="logo">
            <img src="/icons/zc-logo.png" alt="logo" />
          </div>
          <div className="form-heading">Welcome to Zapchat</div>
          <div className="form-underheading">
            Welcome! Please enter your details.
          </div>

          {/* Name */}
          <div className="input-wrapper">
            <label>Name</label>
            <div className="icon-input-wrapper">
              <img src="/icons/user-icon.png" alt="icon" />
              <input
                placeholder="Enter your name"
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
              />
            </div>
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          {/* Lastname */}
          <div className="input-wrapper">
            <label>Lastname</label>
            <div className="icon-input-wrapper">
              <img src="/icons/user-icon.png" alt="icon" />
              <input
                placeholder="Enter your lastname"
                type="text"
                {...register("last_name", {
                  required: "Lastname is required",
                })}
              />
            </div>
            {errors.last_name && (
              <p className="error-text">{errors.last_name.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="input-wrapper">
            <label>Username</label>
            <div className="icon-input-wrapper">
              <img src="/icons/user-icon.png" alt="icon" />
              <input
                placeholder="Enter your username"
                type="text"
                {...register("username", {
                  required: "Username is required",
                })}
              />
            </div>
            {errors.username && (
              <p className="error-text">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
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
          </div>

          {/* Confirm Password */}
          <div className="input-wrapper">
            <label>Confirm password</label>
            <div className="icon-input-wrapper">
              <img src="/icons/password-icon.png" alt="icon" />
              <input
                placeholder="Confirm your password"
                type="password"
                {...register("password_confirmation", {
                  required: "Please confirm password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
            </div>
            {errors.password_confirmation && (
              <p className="error-text">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <div onClick={() => navigate("/login")} className="form-link-text">
            Already have an account? Login
          </div>

          <div>
            <button type="submit" className="btn-primary">
              <span>Sign in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
