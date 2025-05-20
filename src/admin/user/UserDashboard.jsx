import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/UI/Loading";
import { toast } from "react-toastify";
import { allUsers } from "../../redux/slices/UserSlice";
import "./UserDashboard.css";
import ModalPopup from "../../components/UI/ModalPopup";
import { Button, Table } from "reactstrap";
import ExportCSV from "../../utils/ExportCSV";
import ReactPaginate from "react-paginate";
import EditUserModal from "./EditUserModal";
import BlockUserModal from "./BlockUserModal";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.currentUser);
  const users = useSelector((state) => state.user?.users);
  const totalPages = useSelector((state) => state.user?.totalPages);
  const [usersExport, setUsersExport] = useState([]);
  const newAll = usersExport?.map((obj) => {
    const newObj = { ...obj };
    delete newObj.password;
    return newObj;
  });
  const [searchUser, setSearchUser] = useState(null);
  const newUsers = users?.filter((item) => item.id !== user.id);

  const fetchAllUserToExport = async () => {
    const res = await axios.get(`http://localhost:8080/api/user/all-user`, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    setUsersExport(res.data.data);
  };

  const fetchAllUser = async (page) => {
    const res = await axios.get(
      `http://localhost:8080/api/user/all?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
    dispatch(allUsers(res.data));
  };

  