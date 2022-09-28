import React from "react";
import { Outlet } from "react-router-dom";
import NavMenu from "./NavMenu";

const Layout = () => {
  return (
    <main className="App">
      <NavMenu />
      <Outlet />
    </main>
  );
};

export default Layout;
