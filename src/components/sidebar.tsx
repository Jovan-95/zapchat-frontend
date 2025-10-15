/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { NavLink } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../services/authServices";
import { logoutUserFromReduxAndLS } from "../redux/slice";
// import { pusher } from "../pusherClient";

function Sidebar() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    // Logged user from Redux
    // const loggedUser = useSelector(
    //     (state: RootState) => state.auth.loggedInUser
    // );

    // HTTP POST
    const logoutUserMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            // console.log("Temporary use because of build", data);

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

            alert("Logout failed!");
        },
    });

    function handleLogout() {
        logoutUserMutation.mutate();
        queryClient.clear();
    }
    return (
        <div className="sidebar">
            <div className="logo-wrapper">
                <img src="/icons/zc-logo.png" alt="logo" />
            </div>
            <div className="nav">
                <NavLink to={"/"}>
                    {" "}
                    <div className="nav-item">
                        <img src="/icons/chat-icon.png" alt="chat icon" />
                        {/* <span>Chat</span> */}
                    </div>
                </NavLink>
                <NavLink to={"/settings"}>
                    {" "}
                    <div className="nav-item">
                        <img src="/icons/settings-icon.png" alt="logo" />
                        {/* <span>Settings</span> */}
                    </div>
                </NavLink>
            </div>
            <div className="profile">
                {/* <img
                    src={`http://localhost:8000/${loggedUser?.image_path}`}
                    alt="Profile img"
                /> */}
                <div>
                    <img
                        onClick={handleLogout}
                        src="/icons/logout-icon.png"
                        alt="logout icon"
                    />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
