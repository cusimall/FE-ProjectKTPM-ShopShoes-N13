import React, { useEffect, useState } from "react";
import { Container, Row, Table, Button } from "reactstrap";
import "./ManagerProduct.css";
import ExportCSV from "../../utils/ExportCSV";
import Loading from "../../components/UI/Loading";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete, MdAddCircleOutline } from "react-icons/md";
import { BiImport } from "react-icons/bi";
import { motion } from "framer-motion";
import AddProductModal from "./AddProductModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProduct,
} from "../../redux/slices/managerProductSlice";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { importExcel } from "../../api/product";

const ManagerProduct = () => {
  const navigate = useNavigate();
  // redux toolkit
  const isError = useSelector((state) => state.managerProduct?.isError);
  const isLoading = useSelector((state) => state.managerProduct?.isLoading);
  const dataProducts = useSelector((state) => state.managerProduct?.products);
  const error = useSelector((state) => state.managerProduct?.error);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.currentUser);

  // modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  // search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // function call api
  // const pageProduct = async (page) => {
  //   const res = await axios.get(
  //     `http://localhost:8080/api/product/all-products?page=${page}`
  //   );
  //   dispatch(dataProductsPage(res.data));
  // };
  const fetchAllProducts = () => {
    const token = localStorage.getItem('token');
    console.log('ManagerProduct - Current token:', token);
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    console.log('Fetching all products...');
    dispatch(fetchAllProduct());
  };
  useEffect(() => {
    console.log('ManagerProduct component mounted');
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Current auth state:', {
      hasToken: !!token,
      token: token,
      userData: userData,
      currentPath: window.location.pathname
    });
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    fetchAllProducts();
    // pageProduct(0);
  }, [dispatch, navigate]);

  //
  // const handlePageChange = async (e) => {
  //   await pageProduct(e.selected);
  // };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Vui lòng chọn file Excel!");
      return;
    }

    console.log('=== BẮT ĐẦU XỬ LÝ FILE EXCEL ===');
    console.log('Tên file:', file.name);
    console.log('Kích thước file:', file.size, 'bytes');

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        console.log('=== ĐỌC DỮ LIỆU TỪ FILE ===');
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        console.log('Số dòng dữ liệu:', data.length);
        
        if (data.length < 2) {
          toast.error("File Excel không có dữ liệu!");
          return;
        }

        const [header, ...rows] = data;
        console.log('Header:', header);
        
        // Validate header
        const requiredHeaders = ['productName', 'description', 'category', 'productPrice', 'imgUrl', 'quantity', 'designer', 'brandName'];
        const missingHeaders = requiredHeaders.filter(h => !header.includes(h));
        if (missingHeaders.length > 0) {
          console.error('Thiếu các cột:', missingHeaders);
          toast.error(`Thiếu các cột: ${missingHeaders.join(', ')}`);
          return;
        }

        console.log('=== XỬ LÝ TỪNG DÒNG DỮ LIỆU ===');
        const products = rows
          .filter((row) => row.length > 0)
          .map((row, index) => {
            console.log(`\nXử lý dòng ${index + 2}:`, row);
            const obj = {};
            header.forEach((key, idx) => {
              obj[key] = row[idx];
            });
            console.log('Dữ liệu đã map:', obj);

            // Validate required fields
            const missingFields = [];
            if (!obj.productName) missingFields.push('productName');
            if (!obj.description) missingFields.push('description');
            if (!obj.category) missingFields.push('category');
            if (!obj.productPrice) missingFields.push('productPrice');
            if (!obj.imgUrl) missingFields.push('imgUrl');
            if (!obj.quantity) missingFields.push('quantity');
            if (!obj.designer) missingFields.push('designer');
            if (!obj.brandName) missingFields.push('brandName');

            if (missingFields.length > 0) {
              console.error(`Dòng ${index + 2} thiếu trường:`, missingFields);
              throw new Error(`Dòng ${index + 2} thiếu thông tin: ${missingFields.join(', ')}`);
            }

            // Validate numeric fields
            if (isNaN(Number(obj.productPrice)) || Number(obj.productPrice) < 0) {
              console.error(`Dòng ${index + 2} giá không hợp lệ:`, obj.productPrice);
              throw new Error(`Dòng ${index + 2}: Giá sản phẩm không hợp lệ`);
            }

            if (isNaN(Number(obj.quantity)) || Number(obj.quantity) < 1) {
              console.error(`Dòng ${index + 2} số lượng không hợp lệ:`, obj.quantity);
              throw new Error(`Dòng ${index + 2}: Số lượng sản phẩm phải ít nhất là 1`);
            }

            const product = {
              productName: String(obj.productName).trim(),
              description: String(obj.description).trim(),
              category: String(obj.category).trim(),
              productPrice: Number(obj.productPrice),
              imgUrl: String(obj.imgUrl).trim(),
              quantity: Number(obj.quantity),
              designer: String(obj.designer).trim(),
              brandName: String(obj.brandName).trim(),
              reorderLevel: Number(obj.reorderLevel) || 5
            };

            console.log('Dữ liệu sản phẩm sau khi xử lý:', product);

            // Validate string lengths
            if (product.productName.length > 100) {
              console.error(`Dòng ${index + 2} tên quá dài:`, product.productName);
              throw new Error(`Dòng ${index + 2}: Tên sản phẩm không được vượt quá 100 ký tự`);
            }

            // Validate URL format
            try {
              new URL(product.imgUrl);
            } catch (e) {
              console.error(`Dòng ${index + 2} URL không hợp lệ:`, product.imgUrl);
              throw new Error(`Dòng ${index + 2}: URL hình ảnh không hợp lệ`);
            }

            return product;
          });

        console.log('\n=== KẾT QUẢ XỬ LÝ ===');
        console.log('Tổng số sản phẩm hợp lệ:', products.length);
        console.log('Danh sách sản phẩm:', products);

        if (products.length === 0) {
          toast.error("Không có dữ liệu hợp lệ để import!");
          return;
        }

        const token = user?.accessToken || localStorage.getItem("token");
        if (!token) {
          console.error('Không tìm thấy token');
          toast.error("Vui lòng đăng nhập lại!");
          navigate('/login');
          return;
        }

        console.log('\n=== GỬI DỮ LIỆU LÊN SERVER ===');
        // Log chi tiết sản phẩm trước khi gửi
        console.log('Dữ liệu sản phẩm trước khi gửi:', JSON.stringify(products[0], null, 2));
        
        // Gọi API import
        const response = await importExcel(file);
        console.log('Response từ server:', response);
        console.log('Response data:', response.data);
        
        if (response.data.status === "ok") {
          const importedProducts = response.data.data;
          console.log('Sản phẩm đã import:', importedProducts);
          
          if (importedProducts && importedProducts.length > 0) {
            toast.success(`Import thành công ${importedProducts.length} sản phẩm!`);
          } else {
            // Log chi tiết sản phẩm đang cố import
            console.log('Sản phẩm đang cố import:', JSON.stringify(products[0], null, 2));
            
            // Kiểm tra xem có phải do trùng tên không
            const productName = products[0]?.productName;
            if (productName) {
              toast.warn(`Không thể import sản phẩm "${productName}" vì đã tồn tại trong hệ thống!`);
            } else {
              toast.warn("Không có sản phẩm nào được thêm!");
            }
          }
          dispatch(fetchAllProduct());
        } else {
          console.error('Lỗi từ server:', response.data);
          toast.error(response.data.message || "Lỗi khi import sản phẩm!");
        }
      } catch (err) {
        console.error("=== LỖI XỬ LÝ ===");
        console.error("Chi tiết lỗi:", err);
        if (err.response) {
          console.error('Lỗi server:', err.response.data);
          toast.error("Lỗi server: " + (err.response.data.message || "Không xác định"));
        } else {
          toast.error("Lỗi import: " + (err.message || "Không xác định"));
        }
      }
    };
    reader.onerror = (error) => {
      console.error('=== LỖI ĐỌC FILE ===');
      console.error('Chi tiết lỗi:', error);
      toast.error("Lỗi đọc file Excel!");
    };
    reader.readAsBinaryString(file);
  };

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredProducts(dataProducts);
      return;
    }
    // Lọc không phân biệt hoa thường, có dấu hoặc không dấu
    const normalize = (str) => str?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const filtered = dataProducts.filter(product =>
      normalize(product.productName).includes(normalize(value))
    );
    setFilteredProducts(filtered);
  };

  // Cập nhật filteredProducts khi danh sách sản phẩm hoặc searchTerm thay đổi
  useEffect(() => {
    if (searchTerm.trim()) {
      const normalize = (str) => str?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
      setFilteredProducts(
        dataProducts.filter(product =>
          normalize(product.productName).includes(normalize(searchTerm))
        )
      );
    } else {
      setFilteredProducts(dataProducts);
    }
  }, [dataProducts, searchTerm]);

  return (
    <section className="manager-section">
      <Container>
        <div className="mt-3 manager">
          <div className="manager-user">
            <div>
              <i className="ri-product-hunt-line"></i>
            </div>
            <h4>Quản lý sản phẩm</h4>
          </div>
          <div className="search-user">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm tên sản phẩm"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="search-btn">
                <i className="ri-search-line"></i>
              </button>
            </div>

            <div className="btn-file-product">
              <Button
                color="success"
                className="add-btn-product"
                onClick={() => setModal(true)}
              >
                <MdAddCircleOutline />
                <h6>Thêm sản phẩm</h6>
              </Button>
              <Button className="add-btn-product" color="info" onClick={() => document.getElementById("import-excel").click()}>
                <BiImport />
              </Button>
              <input
                id="import-excel"
                type="file"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleImportExcel}
              />
              <ExportCSV csvData={dataProducts} fileName={"all-products"} />
            </div>
          </div>
        </div>
        <Row>
          <div className="mt-5">
            {isLoading ? (
              <Loading />
            ) : isError ? (
              <>
                <h6>Something went wrong</h6>
                <h6>{typeof error === 'object' ? JSON.stringify(error) : error}</h6>
              </>
            ) : (
              <>
                <InfiniteScroll height={600} dataLength={filteredProducts?.length}>
                  <Table hover>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Sửa</th>
                        <th>Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts?.length > 0 ? (
                        filteredProducts.map((data, idx) => (
                          <Tr data={data} key={`key-${idx}`} idx={idx} />
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center">Không tìm thấy sản phẩm phù hợp</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </InfiniteScroll>
              </>
            )}
          </div>
        </Row>
        {/* modals */}
        <AddProductModal modal={modal} toggle={toggle} setModal={setModal} />
      </Container>
    </section>
  );
};

// tung dong
const Tr = ({ data, idx }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [modalDelete, setModalDelete] = useState(false);
  const toggleDelete = () => setModalDelete(!modalDelete);

  return (
    <>
      <tr>
        <td>{data?.id}</td>
        <td>
          <img src={data?.imgUrl} alt="product-img" />
        </td>
        <td>{data?.productName}</td>
        <td>
          {data?.productPrice.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </td>
        <td>{data?.quantity}</td>
        <td>
          <motion.div whileTap={{ scale: 1.2 }} onClick={() => setModal(true)}>
            <Button color="warning">
              <RiEdit2Fill />
            </Button>
          </motion.div>
        </td>
        <td>
          <motion.div
            whileTap={{ scale: 1.2 }}
            onClick={() => setModalDelete(true)}
          >
            <Button color="danger">
              <MdDelete />
            </Button>
          </motion.div>
        </td>
      </tr>
      {/* Render modals outside of table */}
      {modal && (
        <EditProductModal
          modal={modal}
          setModal={setModal}
          toggle={toggle}
          data={data}
        />
      )}
      {modalDelete && (
        <DeleteProductModal
          modal={modalDelete}
          setModal={setModalDelete}
          toggle={toggleDelete}
          text={`sản phẩm ${data?.productName}`}
          data={data}
        />
      )}
    </>
  );
};

export default ManagerProduct;
