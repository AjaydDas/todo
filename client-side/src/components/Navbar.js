import React from "react";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import '../css/home.css'

const Navbar = () => {
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[location.pathname]}>
      <Menu.Item key="/home">
        <NavLink to="/home">Tasks</NavLink>
      </Menu.Item>
      <Menu.Item key="/add">
        <NavLink to="/add">Add Task</NavLink>
      </Menu.Item>
      <Menu.Item key="/about">
        <NavLink to="/about">About</NavLink>
      </Menu.Item>
      <Menu.Item key="/contact">
        <NavLink to="/contact">Contact</NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
