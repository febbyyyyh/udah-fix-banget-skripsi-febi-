import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-[#F7F9FC]">
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col">
                {/* TOPBAR */}
                <Topbar />

                {/* PAGE CONTENT */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
