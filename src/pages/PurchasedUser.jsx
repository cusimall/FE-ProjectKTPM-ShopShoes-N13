import React, { useEffect, useState } from "react";
import { Container, Row, Table, Spinner } from "reactstrap";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInvoices } from "../redux/slices/invoiceSlice";
import InvoiceDetailModal from "../components/UI/InvoiceDetailModal";
import "../styles/purchased.css";

const PurchasedUser = () => {
  const dispatch = useDispatch();
  const { userInvoices, loading } = useSelector((state) => state.invoice);
  const purchasedOrders = useSelector((state) => state.purchased?.orders || []);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchUserInvoices());
      } catch (error) {
        console.log("Error fetching invoices, using purchased orders instead");
      }
    };
    fetchData();
  }, [dispatch]);

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
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

  // Get status display
  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'Đang xử lý';
      case 'processing':
        return 'Đang chuẩn bị';
      case 'shipping':
        return 'Đang giao hàng';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'Không xác định';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return '#17a2b8';
      case 'processing':
        return '#ffc107';
      case 'shipping':
        return '#007bff';
      case 'completed':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };
  
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  
  const viewInvoiceDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  // Kết hợp dữ liệu từ cả Redux store và API
  const allInvoices = [
    ...(Array.isArray(userInvoices) ? userInvoices : []),
    ...(Array.isArray(purchasedOrders) ? purchasedOrders.map(order => ({
      id: order.order_id || Math.random().toString(36).substr(2, 9),
      orderDate: order.orderDate || new Date().toISOString(),
      shipAddress: order.shipAddress || "TP.HCM",
      status: order.status || (order.isPaid ? "completed" : "pending"),
      totalAmount: order.totalAmount || 0,
      items: order.orderItems || []
    })) : [])
  ];

  return (
    <section className="purchased__page">
      <Container>
        <Row>
          <div className="purchased__container">
            <h4 className="fw-bold mb-5">Đơn hàng của tôi</h4>
            {loading ? (
              <div className="text-center">
                <Spinner color="primary" />
              </div>
            ) : allInvoices.length === 0 ? (
              <div className="text-center">
                <h5 className="fw-bold">Bạn chưa có đơn hàng nào</h5>
              </div>
            ) : (
              <Table hover>
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt hàng</th>
                    <th>Địa chỉ giao hàng</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {allInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>#{invoice.id}</td>
                      <td>{formatDate(invoice.orderDate)}</td>
                      <td>{invoice.shipAddress || "TP.HCM"}</td>
                      <td>
                        <span
                          style={{
                            backgroundColor: getStatusColor(invoice.status),
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            display: 'inline-block',
                          }}
                        >
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td>
                        {invoice.totalAmount?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>
                        <motion.button
                          whileTap={{ scale: 1.1 }}
                          className="buy__btn"
                          style={{ verticalAlign: "middle", marginTop: "-4px" }}
                          onClick={() => viewInvoiceDetails(invoice)}
                        >
                          <i className="ri-eye-line"></i>
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Row>
      </Container>
      
      <InvoiceDetailModal 
        isOpen={modalOpen} 
        toggle={toggleModal} 
        invoice={
          selectedInvoice
            ? { ...selectedInvoice, shipAddress: selectedInvoice.shipAddress || "TP.HCM" }
            : null
        }
      />
    </section>
  );
};

export default PurchasedUser;
