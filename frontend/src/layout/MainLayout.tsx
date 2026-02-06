import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

import { useState } from "react";
import { Modal } from "../components/Modal";

type Props = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
    

    return (
        <main className="main-layout">
            <main className="content">{children}</main>
            <Navbar />
            <Sidebar />
        </main>
    )
} 