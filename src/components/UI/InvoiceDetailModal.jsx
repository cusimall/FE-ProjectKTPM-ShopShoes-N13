import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Row,
  Col,
} from "reactstrap";
import { useSelector } from "react-redux";

const InvoiceDetailModal = ({ isOpen, toggle, invoice }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status display
  const getStatusText = (status) => {
    if (!status) return "";
    switch (status.toLowerCase()) {
      case "pending":
        return "Đang xử lý";
      case "processing":
        return "Đang chuẩn bị";
      case "shipping":
        return "Đang giao hàng";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return "#6c757d";
    switch (status.toLowerCase()) {
      case "pending":
        return "#17a2b8"; // info
      case "processing":
        return "#ffc107"; // warning
      case "shipping":
        return "#007bff"; // primary
      case "completed":
        return "#28a745"; // success
      case "cancelled":
        return "#dc3545"; // danger
      default:
        return "#6c757d"; // secondary
    }
  };

  if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Chi tiết đơn hàng #{invoice.id}
      </ModalHeader>
      <ModalBody>
        <Row className="mb-4">
          <Col md={6}>
            <h6 className="mb-3">Thông tin đơn hàng</h6>
            <p>
              <strong>Mã đơn hàng:</strong> #{invoice.id}
            </p>
            <p>
              <strong>Ngày đặt hàng:</strong> {formatDate(invoice.orderDate)}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                style={{
                  backgroundColor: getStatusColor(invoice.status),
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                {getStatusText(invoice.status)}
              </span>
            </p>
          </Col>
          <Col md={6}>
            <h6 className="mb-3">Thông tin giao hàng</h6>
            <p>
              <strong>Địa chỉ:</strong> {invoice.shipAddress}
            </p>
          </Col>
        </Row>

        <h6 className="mb-3">Chi tiết sản phẩm</h6>
        <Table bordered responsive>
          <thead>
            <tr>
              <th>Mã sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.quantity}</td>
                <td>
                  {item.price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                <td>
                  {item.subtotal?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">
                Tổng cộng:
              </td>
              <td className="fw-bold">
                {invoice.totalAmount?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
            </tr>
          </tfoot>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Đóng
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default InvoiceDetailModal; 