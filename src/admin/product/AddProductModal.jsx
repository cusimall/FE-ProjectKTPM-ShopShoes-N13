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
import { addNewProduct, fetchAllProduct } from "../../redux/slices/managerProductSlice";

const AddProductModal = (props) => {
  const { modal, toggle, setModal } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.currentUser);

  const [dataAddProduct, setDataNewProduct] = useState({
    productName: "",
    description: "",
    productPrice: "0",
    category: "",
    imgUrl: "",
    quantity: 1,
    designer: "",
    brandName: "",
    reorderLevel: 5
  });

  const handleAddProduct = async () => {
    console.log('=== BẮT ĐẦU THÊM SẢN PHẨM MỚI ===');
    console.log('Dữ liệu sản phẩm:', dataAddProduct);

    // Validate data before sending
    if (!dataAddProduct.productName?.trim()) {
      toast.error("Tên sản phẩm không được để trống!");
      return;
    }
    
    if (dataAddProduct.productName.length > 100) {
      toast.error("Tên sản phẩm không được vượt quá 100 ký tự!");
      return;
    }

    if (!dataAddProduct.imgUrl?.trim()) {
      toast.error("URL hình ảnh không được để trống!");
      return;
    }

    try {
      new URL(dataAddProduct.imgUrl);
    } catch (e) {
      toast.error("URL hình ảnh không hợp lệ!");
      return;
    }

    if (Number(dataAddProduct.productPrice) < 0) {
      toast.error("Giá sản phẩm không được âm!");
      return;
    }

    if (Number(dataAddProduct.quantity) < 1) {
      toast.error("Số lượng sản phẩm phải ít nhất là 1!");
      return;
    }

    if (!dataAddProduct.description?.trim()) {
      toast.error("Mô tả sản phẩm không được để trống!");
      return;
    }

    if (!dataAddProduct.category?.trim()) {
      toast.error("Danh mục sản phẩm không được để trống!");
      return;
    }

    if (!dataAddProduct.designer?.trim()) {
      toast.error("Tên nhà thiết kế không được để trống!");
      return;
    }

    if (!dataAddProduct.brandName?.trim()) {
      toast.error("Tên thương hiệu không được để trống!");
      return;
    }

    // Format data before sending
    const formattedData = {
      productName: dataAddProduct.productName.trim(),
      description: dataAddProduct.description.trim(),
      category: dataAddProduct.category.trim(),
      productPrice: Number(dataAddProduct.productPrice),
      imgUrl: dataAddProduct.imgUrl.trim(),
      quantity: Number(dataAddProduct.quantity),
      designer: dataAddProduct.designer.trim(),
      brandName: dataAddProduct.brandName.trim(),
      reorderLevel: Number(dataAddProduct.reorderLevel) || 5
    };

    console.log('Dữ liệu đã format:', formattedData);

    try {
      if (!user?.accessToken) {
        console.error('Không tìm thấy token xác thực');
        toast.error("Không tìm thấy token xác thực!");
        return;
      }

      console.log('Gửi request thêm sản phẩm...');
      const res = await dispatch(addNewProduct({
        data: formattedData,
        token: user.accessToken
      })).unwrap();
      
      console.log('Response từ server:', res);
      
      if (res?.status === "ok") {
        setModal(false);
        toast.success("Thêm sản phẩm mới thành công!");
        
        // Refresh product list
        dispatch(fetchAllProduct());
      } else {
        console.error('Lỗi từ server:', res);
        toast.error(res?.message || "Có lỗi xảy ra khi thêm sản phẩm!");
      }
    } catch (error) {
      console.error('=== LỖI THÊM SẢN PHẨM ===');
      console.error('Chi tiết lỗi:', error);
      
      if (error?.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error?.message) {
        if (error.message.includes("product name has already been taken")) {
          toast.error("Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Có lỗi xảy ra khi thêm sản phẩm!");
      }
    } finally {
      console.log('Reset form data');
      setDataNewProduct({
        productName: "",
        description: "",
        productPrice: "0",
        category: "",
        imgUrl: "",
        quantity: 1,
        designer: "",
        brandName: "",
        reorderLevel: 5
      });
    }
  };

  const handleData = (e) => {
    setDataNewProduct((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} size="xl">
        <ModalHeader toggle={toggle}>Thêm mới sản phẩm:</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup row>
              <Label sm={2}>Tên sản phẩm:</Label>
              <Col sm={10}>
                <Input
                  placeholder="Nhập tên sản phẩm"
                  type="text"
                  required
                  name="productName"
                  value={dataAddProduct.productName}
                  onChange={handleData}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Hình ảnh sản phẩm:</Label>
              <Col sm={10}>
                <Input
                  placeholder="Đường dẫn hình ảnh sản phẩm"
                  type="text"
                  required
                  name="imgUrl"
                  value={dataAddProduct.imgUrl}
                  onChange={handleData}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Số lượng:</Label>
              <Col sm={10}>
                <Input
                  type="number"
                  required
                  value={dataAddProduct.quantity}
                  onChange={handleData}
                  name="quantity"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Giá bán:</Label>
              <Col sm={10}>
                <Input
                  required
                  type="number"
                  value={dataAddProduct.productPrice}
                  onChange={handleData}
                  name="productPrice"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Mô tả sản phẩm:</Label>
              <Col sm={10}>
                <Input
                  type="textarea"
                  required
                  value={dataAddProduct.description}
                  onChange={handleData}
                  name="description"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Doanh mục:</Label>
              <Col sm={10}>
                <Input
                  placeholder="Nhập doanh mục sản phẩm"
                  type="text"
                  required
                  value={dataAddProduct.category}
                  onChange={handleData}
                  name="category"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Nhà thiết kế:</Label>
              <Col sm={10}>
                <Input
                  placeholder="Nhập tên nhà thiết kế sản phẩm"
                  type="text"
                  required
                  value={dataAddProduct.designer}
                  onChange={handleData}
                  name="designer"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={2}>Thương hiệu:</Label>
              <Col sm={10}>
                <Input
                  placeholder="Nhập tên thương hiệu sản phẩm"
                  type="text"
                  required
                  value={dataAddProduct.brandName}
                  onChange={handleData}
                  name="brandName"
                />
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddProduct}>
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

export default AddProductModal;
