import { useState } from "react";
import MobileModal from "./mobileModal";
import { NavLink } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../services/authServices";
import { logoutUserFromReduxAndLS } from "../redux/slice";
import { useDispatch } from "react-redux";
import { showErrorToast } from "./toast";

function MobileHeader() {
    const [mobModal, setMobModal] = useState(false);
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    // HTTP POST
    const logoutUserMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            // Clear localStorage
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("auth_token");

            // Redux
            dispatch(logoutUserFromReduxAndLS());

            // Navigation
            window.location.href = "/login"; // navigate and refresh home
        },
        onError: (err) => {
            console.log("Temporary use because of build", err);

            showErrorToast("Logout failed!");
        },
    });

    function handleLogout() {
        logoutUserMutation.mutate();
        queryClient.clear();
    }
    return (
        <>
            <div className="mobille-header-wrapper">
                <div className="menu-icon-wrapper">
                    <img
                        onClick={() => setMobModal((prev) => !prev)}
                        src="icons/hamburger-menu-icon.png"
                        alt="mobile-menu-icon"
                    />
                </div>
            </div>
            {mobModal ? (
                <MobileModal>
                    <div>
                        <div className="close-icon-wrapper">
                            <img
                                onClick={() => setMobModal(false)}
                                src="icons/close-icon.png"
                                alt="close-icon"
                            />
                        </div>
                        <div className="navigation">
                            {" "}
                            <NavLink
                                to={"/"}
                                onClick={() => setMobModal(false)}
                            >
                                {" "}
                                <div className="nav-item">
                                    <span>Chat</span>
                                </div>
                            </NavLink>
                            <NavLink
                                to={"/settings"}
                                onClick={() => setMobModal(false)}
                            >
                                {" "}
                                <div className="nav-item">
                                    <span>Settings</span>
                                </div>
                            </NavLink>
                            <div className="nav-item">
                                <span onClick={handleLogout}>Logout</span>
                                {/* <img
                                    onClick={handleLogout}
                                    src="/icons/logout-icon.png"
                                    alt="logout icon"
                                /> */}
                            </div>
                        </div>
                    </div>
                </MobileModal>
            ) : (
                ""
            )}
        </>
    );
}

export default MobileHeader;
