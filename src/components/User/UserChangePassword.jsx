import React, { useState } from "react";
import { motion } from "framer-motion";
import "./UserChangePassword.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

const UserChangePassword = () => {
  const [changePass, setChangePass] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setChangePass((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  const user = useSelector((state) => state.auth?.currentUser);

  const submitChangePass = async () => {
    // Validate password length
    if (changePass.newPassword.length < 6 || changePass.newPassword.length > 120) {
      return toast.error("Mật khẩu phải từ 6 đến 120 ký tự!");
    }

    if (changePass.newPassword !== changePass.confirmPassword) {
      return toast.error("Yêu cầu mật khẩu mới phải trùng khớp!");
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/users/${user?.id}/change-password`,
        changePass,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      if (res?.status === 200) {
        toast.success("Đổi mật khẩu thành công!");
        setChangePass({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      <div className="content">
        <div className="content_title">Đổi mật khẩu</div>
        <div className="content_text">
          Để đảm bảo an toàn, vui lòng không chia sẻ mật khẩu cho người dùng
          khác
        </div>

        <table className="content_form">
          <tr className="content_form_item">
            <td className="content_form_item_label">
              <label htmlFor="">Mật khẩu hiện tại</label>
            </td>
            <td className="content_form_item_input">
              <input
                type="password"
                className="content_form_item_input_date"
                value={changePass.currentPassword}
                name="currentPassword"
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr className="content_form_item">
            <td className="content_form_item_label">
              <label htmlFor="">Mật khẩu mới</label>
            </td>
            <td className="content_form_item_input">
              <input
                type="password"
                className="content_form_item_input_date"
                value={changePass.newPassword}
                name="newPassword"
                onChange={handleChange}
              />
            </td>
          </tr>

          <tr className="content_form_item">
            <td className="content_form_item_label">
              <label htmlFor="">Nhập lại mật khẩu</label>
            </td>
            <td className="content_form_item_input">
              <input
                type="password"
                className="content_form_item_input_date"
                value={changePass.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
              />
            </td>
          </tr>
        </table>
      </div>

      <div className="pass-btn">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.2 }}
          className="buy__btn"
          onClick={submitChangePass}
        >
          Lưu mật khẩu
        </motion.button>
      </div>
    </div>
  );
};

export default UserChangePassword;
