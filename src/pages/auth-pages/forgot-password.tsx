/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordReq } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ForgotPassField } from "../../types/type";
import { showErrorToast, showInfoToast } from "../../components/toast";

function ForgotPassword() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPassField>();

    // HTTP POST
    const forgotPassMutation = useMutation({
        mutationFn: forgotPasswordReq,
        onSuccess: (data) => {
            if (data && data.status) {
                showInfoToast("Instruction are sent to your email!");
            }
        },
        onError: () => {
            showErrorToast("Error!");
        },
    });

    function onSubmit(data: ForgotPassField) {
        console.log("Data", data);
        forgotPassMutation.mutate(data.email);
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
                    <div className="form-heading">Forgot Password?</div>
                    <div className="form-underheading">
                        No worries, we’ll send you reset instructions.
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

                    <div
                        onClick={() => navigate("/login")}
                        className="form-link-text"
                    >
                        Login?
                    </div>
                    <div>
                        <button type="submit" className="btn-primary">
                            <span>Send</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
