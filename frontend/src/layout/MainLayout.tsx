import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

type Props = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
    return (
        <div className="app-container">
            <Navbar />
            <main className="content">{children}</main>
            <Sidebar />
        </div>
    )
} 