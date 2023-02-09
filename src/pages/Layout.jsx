import React from "react";
import {Outlet} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = () => {
    return (
    <div>
        <Header />
        <div id="page-content">
            <Outlet />
            <div id="footer">
                <Footer />
            </div>
        </div>
    </div>
    );
};

export default Layout;