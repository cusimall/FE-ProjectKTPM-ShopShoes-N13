import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Col,
} from "reactstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "../../axiosConfig";
import { editProfile } from "../../redux/slices/authSlice";

const EditUserModal = (props) => {
  const { modal, toggle, setModal, data, id } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.currentUser);

  const [dataEditUser, setDataEditUser] = useState({
    email: "",
    address: "",
    phone: null,
    gender: "",
    birth: null
  });

  useEffect(() => {
    // Format birth date to YYYY-MM-DD if it exists
    const formattedData = {
      ...data,
      birth: data.birth ? new Date(data.birth).toISOString().split('T')[0] : null
    };
    setDataEditUser(formattedData);
  }, [data]);

  const handleEditData = async () => {
    try {
      const res = await axios.put(
        `/api/users/${id}`,
        dataEditUser
      );
      
      console.log('Server response:', res.data);
      
      if (res?.status === 200) {
        dispatch(editProfile(res.data));
        localStorage.setItem('user', JSON.stringify(res.data.data));
        setModal(false);
        toast.success("Chỉnh sửa thông tin thành công!");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin!");
      setModal(false);
    }
  };

  const handleData = (e) => {
    setDataEditUser((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Chỉnh sửa thông tin cá nhân:</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label sm={2}>Email:</Label>
              <Col sm={10}>
                <Input
                  placeholder="Email"
                  type="email"
                  required
                  name="email"
                  value={dataEditUser.email}
                  onChange={handleData}
                  disabled
                  style={{ backgroundColor: '#e9ecef' }}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Địa chỉ:</Label>
              <Col sm={10}>
                <Input
                  placeholder="Địa chỉ"
                  type="text"
                  required
                  name="address"
                  value={dataEditUser.address}
                  onChange={handleData}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Số điện thoại:</Label>
              <Col sm={10}>
                <Input
                  type="number"
                  required
                  value={dataEditUser.phone}
                  onChange={handleData}
                  name="phone"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Giới tính:</Label>
              <Col sm={10}>
                <Input
                  type="select"
                  name="gender"
                  value={dataEditUser.gender}
                  onChange={handleData}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Ngày sinh:</Label>
              <Col sm={10}>
                <Input
                  type="date"
                  name="birth"
                  value={dataEditUser.birth || ''}
                  onChange={handleData}
                />
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleEditData()}>
            Lưu thay đổi
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EditUserModal;
