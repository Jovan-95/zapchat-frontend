/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordReq } from "../../services/authServices";
import { useForm } from "react-hook-form";
import { ResetUserObj } from "../../types/type";
import { showErrorToast, showSuccessToast } from "../../components/toast";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    console.log("Token: ", token);
    console.log("Email: ", email);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetUserObj>();

    const password = watch("password");

    // HTTP POST
    const resetPassMutation = useMutation({
        mutationFn: resetPasswordReq,
        onSuccess: (data) => {
            if (data && data.status) {
                showSuccessToast("Reset is successfull!");
                navigate("/login");
            }
        },
        onError: () => {
            showErrorToast("Error!");
        },
    });

    function onSubmit(data: ResetUserObj) {
        resetPassMutation.mutate({
            ...data,
            token,
            email,
        });
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
                    <div className="form-heading">Reset Password</div>
                    <div className="form-underheading">Create Password</div>

                    <div className="input-wrapper">
                        <label>New Password</label>
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
                            <p className="error-text">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="input-wrapper">
                        <label>Confirm New Password</label>
                        <div className="icon-input-wrapper">
                            <img src="/icons/password-icon.png" alt="icon" />
                            <input
                                placeholder="Confirm your password"
                                type="password"
                                {...register("password_confirmation", {
                                    required: "Please confirm password",
                                    validate: (value) =>
                                        value === password ||
                                        "Passwords do not match",
                                })}
                            />
                        </div>
                        {errors.password_confirmation && (
                            <p className="error-text">
                                {errors.password_confirmation.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <button className="btn-primary mt-16">
                            <span>Send</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
