import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";

const BlockUserModal = ({ toggle, modal, setModal, text, onSuccess }) => {
  const user = useSelector((state) => state.auth?.currentUser);
  const dispatch = useDispatch();

  const handleBlock = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/users/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      toast.success("Chặn người dùng thành công!");
      setModal(!modal);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Có lỗi xảy ra khi chặn người dùng");
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} scrollable={true}>
        <ModalHeader toggle={toggle}>
          Xác nhận chặn người dùng
        </ModalHeader>
        <ModalBody>
          {`Bạn có muốn chặn người dùng: `}
          <b>{text}</b>
          {" này không?"}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleBlock}>
            Chặn
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default BlockUserModal;
