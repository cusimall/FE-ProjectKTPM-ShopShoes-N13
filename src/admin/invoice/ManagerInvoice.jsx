import React, { useEffect, useState } from "react";
import {Container,Row,Table,Button,Modal,ModalHeader,ModalBody,ModalFooter,Col,Form,FormGroup,Label,Input,Nav,NavItem,NavLink,TabContent,TabPane,} from "reactstrap";
import "../user/UserDashboard.css";
import "./ManagerInvoice.css";
import ReactPaginate from "react-paginate";
import { DatePicker } from "reactstrap-date-picker";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoicesByStatus } from "../../redux/slices/invoiceSlice";
import { updateInvoiceStatus } from "../../api/invoice";
import { useNavigate } from "react-router-dom";
import classnames from 'classnames';
import { toast } from 'react-toastify';

const ManagerInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allInvoices, loading, totalPages } = useSelector((state) => state.invoice);
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setPage(0); // Reset về trang đầu khi chuyển tab
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredInvoices(allInvoices);
      return;
    }

    const filtered = allInvoices.filter(invoice => 
      invoice.id.toString().includes(value.trim())
    );
    setFilteredInvoices(filtered);
  };

  useEffect(() => {
    // Kiểm tra token và quyền admin
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Kiểm tra quyền admin
    const isAdmin = userData?.roles?.includes('ROLE_ADMIN');
    if (!isAdmin) {
      navigate('/home');
      return;
    }

    // Nếu có quyền admin, fetch dữ liệu
    dispatch(fetchInvoicesByStatus({ status: activeTab, page, size: 10 }));
  }, [dispatch, page, navigate, activeTab]);

  // Cập nhật filteredInvoices khi allInvoices thay đổi
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allInvoices.filter(invoice => 
        invoice.id.toString().includes(searchTerm.trim())
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(allInvoices);
    }
  }, [allInvoices, searchTerm]);

  // Xử lý phân trang
  const handlePageClick = (selectedItem) => {
    setPage(selectedItem.selected);
  };

  return (
    <section className="manager-section">
      <Container>
        <div className="mt-3 manager">
          <div className="manager-user">
            <div>
              <FaFileInvoiceDollar fontSize={24} />
            </div>
            <h4>Quản lý hóa đơn</h4>
          </div>
          <div className="search-user">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Tìm kiếm theo mã đơn hàng" 
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="search-btn">
                <i className="ri-search-line"></i>
              </button>
            </div>
          </div>
        </div>

        <Nav tabs className="mt-4">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'PENDING' })}
              onClick={() => toggle('PENDING')}
            >
              Đang xử lý
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'PROCESSING' })}
              onClick={() => toggle('PROCESSING')}
            >
              Đang giao hàng
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'COMPLETED' })}
              onClick={() => toggle('COMPLETED')}
            >
              Đã hoàn thành
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'CANCELLED' })}
              onClick={() => toggle('CANCELLED')}
            >
              Đã hủy
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId={activeTab}>
            <Row>
              <div className="mt-5">
                {loading ? (
                  <div className="text-center">Đang tải dữ liệu...</div>
                ) : (
                  <>
                    <Table hover bordered>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Mã đơn hàng</th>
                          <th>Ngày</th>
                          <th>Trạng thái</th>
                          <th>Tổng cộng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices && filteredInvoices.length > 0 ? (
                          filteredInvoices.map((item, idx) => (
                            <Tr data={item} key={item.id || idx} idx={idx + page * 10} />
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center">
                              {searchTerm ? 'Không tìm thấy đơn hàng' : 'Không có đơn hàng nào'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {!searchTerm && totalPages > 0 && (
                      <ReactPaginate
                        previousLabel="<"
                        nextLabel=">"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        pageCount={totalPages}
                        pageRangeDisplayed={5}
                        containerClassName="pagination"
                        activeClassName="active"
                        onPageChange={handlePageClick}
                        forcePage={page}
                      />
                    )}
                  </>
                )}
              </div>
            </Row>
          </TabPane>
        </TabContent>
      </Container>
    </section>
  );
};

const Tr = ({ data, idx }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  
  // Định dạng ngày
  const formatDate = (dateString) => {
    try {
      const date = new Date(data?.orderDate || dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Hàm lấy màu và text cho trạng thái
  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { color: 'info', text: 'Đang xử lý' };
      case 'PROCESSING':
        return { color: 'warning', text: 'Đang giao hàng' };
      case 'COMPLETED':
        return { color: 'success', text: 'Đã hoàn thành' };
      case 'CANCELLED':
        return { color: 'danger', text: 'Đã hủy' };
      case 'REFUNDED':
        return { color: 'secondary', text: 'Đã hoàn tiền' };
      default:
        return { color: 'info', text: status || 'Đang xử lý' };
    }
  };

  const statusInfo = getStatusInfo(data?.status);

  return (
    <>
      <tr>
        <td>{idx + 1}</td>
        <td>{data?.id}</td>
        <td>{formatDate(data?.orderDate)}</td>
        <td>
          <Button
            color={statusInfo.color}
            onClick={toggle}
          >
            {statusInfo.text}
          </Button>
        </td>
        <td>
          {data?.totalAmount?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </td>
      </tr>
      {modal && <ModalInvoice modal={modal} toggle={toggle} data={data} />}
    </>
  );
};

const ModalInvoice = ({ modal, toggle, data }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(data?.status || 'PENDING');
  const [isUpdating, setIsUpdating] = useState(false);

  // Hàm lấy màu và text cho trạng thái
  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { color: 'info', text: 'Đang xử lý' };
      case 'PROCESSING':
        return { color: 'warning', text: 'Đang giao hàng' };
      case 'COMPLETED':
        return { color: 'success', text: 'Đã hoàn thành' };
      case 'CANCELLED':
        return { color: 'danger', text: 'Đã hủy' };
      case 'REFUNDED':
        return { color: 'secondary', text: 'Đã hoàn tiền' };
      default:
        return { color: 'info', text: status || 'Đang xử lý' };
    }
  };

  const statusInfo = getStatusInfo(status);

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      console.log('Updating invoice status:', { invoiceId: data.id, status });
      
      const response = await updateInvoiceStatus(data.id, status);
      console.log('Update response:', response);
      
      if (response?.data?.status === 'SUCCESS') {
        toast.success('Cập nhật trạng thái thành công');
        // Refresh lại danh sách đơn hàng sau khi cập nhật thành công
        await dispatch(fetchInvoicesByStatus({ status: data.status, page: 0, size: 10 }));
        toggle(); // Đóng modal sau khi cập nhật thành công
      } else {
        toast.error(response?.data?.message || 'Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        toast.error(error.response.data?.message || 'Cập nhật trạng thái thất bại');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        toast.error('Không thể kết nối đến máy chủ');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Cập nhật status khi data thay đổi
  useEffect(() => {
    if (data?.status) {
      setStatus(data.status);
    }
  }, [data]);

  return (
    <Modal isOpen={modal} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Chi tiết đơn hàng #{data?.id}</ModalHeader>
      <ModalBody>
        <div className="invoice-container">
          <div className="invoice-header">
            <h5>Đặt hàng #{data?.id} chi tiết</h5>
            <p>
              Thanh toán qua Trả tiền mặt khi nhận hàng
            </p>
          </div>
          <div className="grid-container">
            <Row lg={12}>
              <Col>
                <div className="date-grid">
                  <h6>Chung</h6>
                  <Form>
                    <FormGroup>
                      <Label>Ngày tạo</Label>
                      <DatePicker
                        placeholder="MM/DD/YYYY"
                        value={data?.orderDate}
                        disabled
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Trạng thái</Label>
                      <Input 
                        name="select" 
                        type="select" 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="PENDING">Đang xử lý</option>
                        <option value="PROCESSING">Đang giao hàng</option>
                        <option value="COMPLETED">Đã hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                        <option value="REFUNDED">Đã hoàn tiền</option>
                      </Input>
                    </FormGroup>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Chi phí</th>
                <th>SL</th>
                <th>Tổng cộng</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((item, index) => (
                <tr key={index}>
                  <th scope="row">
                    <span style={{ marginLeft: "20px" }}>
                      Sản phẩm #{item.productId}
                    </span>
                  </th>
                  <td>
                    {item.price?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td>x{item.quantity}</td>
                  <td>
                    {item.subtotal?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div>
            <h6 style={{ textAlign: "end", marginRight: "50px" }}>
              Tổng cộng:
              <span style={{ marginLeft: "20px" }}>
                {data?.totalAmount?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </h6>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpdateStatus} disabled={isUpdating}>
          {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ManagerInvoice;
