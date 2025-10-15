import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import MobileHeader from "./mobileHeader";

function Layout() {
    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main">
                <MobileHeader />
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
