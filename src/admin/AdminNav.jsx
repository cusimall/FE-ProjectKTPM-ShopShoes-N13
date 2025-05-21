import React, { useState } from "react";
import {Container,Dropdown,DropdownToggle,DropdownMenu,DropdownItem} from "reactstrap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import avt from "../assets/images/user-icon.png";
import logo from "../assets/images/logoShop.png";
import "./AdminNav.css";

const admin_nav = [
  { display: "Sản phẩm", path: "/dashboard/add-product", icon: "ri-product-hunt-fill" },
  { display: "Đơn hàng", path: "/dashboard/orders", icon: "ri-wallet-2-fill" },
  { display: "Người dùng", path: "/dashboard/users", icon: "ri-user-2-fill" },
  { display: "Thống kê", path: "/dashboard", icon: "ri-dashboard-fill" },
];

const AdminNav = () => {
  const user = useSelector((state) => state.auth?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(logOut());
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/user-menu/profile");
  };

  return (
    <header className="admin__header">
      <Container>
        <div className="admin__nav-wrapper">
          {/* Logo */}
          <div className="admin__logo">
            <img src={logo} alt="logo brand" />
            <a href="/">Shop Shoes</a>
          </div>

          {/* Menu */}
          <ul className="admin__menu-list">
            {admin_nav.map((item, index) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/dashboard" &&
                  location.pathname.startsWith(item.path));

              return (
                <li className="admin__menu-item" key={index}>
                  <NavLink
                    to={item.path}
                    className={isActive ? "active" : ""}
                    end
                  >
                    <i className={item.icon}></i> {item.display}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* User Actions */}
          <div className="admin__nav-right">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret>
                <img
                  src={avt}
                  alt="avt"
                  className="admin__user-avatar"
                />
                {user?.username}
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu">
                <DropdownItem onClick={handleHome}>
                  Trang chủ
                </DropdownItem>
                <DropdownItem onClick={handleProfile}>
                  Tài khoản của tôi
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default AdminNav;
