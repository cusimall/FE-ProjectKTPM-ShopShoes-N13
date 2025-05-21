import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { fetchInvoicesByStatus } from "../../redux/slices/invoiceSlice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Thống kê doanh số theo tháng",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Số lượng đơn hàng'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Tháng'
      }
    }
  }
};

export default function InvoiceBarChart() {
  const dispatch = useDispatch();
  const { allInvoices } = useSelector((state) => state.invoice);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    dispatch(fetchInvoicesByStatus({ status: "COMPLETED", page: 0, size: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (allInvoices && allInvoices.length > 0) {
      // Tạo map để lưu số lượng đơn hàng theo tháng
      const monthMap = {};
      const currentYear = new Date().getFullYear();
      
      // Khởi tạo dữ liệu cho 12 tháng
      for (let i = 1; i <= 12; i++) {
        monthMap[`${i}/${currentYear}`] = 0;
      }

      // Đếm số lượng đơn hàng theo tháng
      allInvoices.forEach((invoice) => {
        if (!invoice.orderDate) return;
        const date = new Date(invoice.orderDate);
        const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
        if (!monthMap[month]) monthMap[month] = 0;
        monthMap[month]++;
      });

      // Chuyển đổi tên tháng sang tiếng Việt
      const monthNames = {
        1: 'Tháng 1', 2: 'Tháng 2', 3: 'Tháng 3', 4: 'Tháng 4',
        5: 'Tháng 5', 6: 'Tháng 6', 7: 'Tháng 7', 8: 'Tháng 8',
        9: 'Tháng 9', 10: 'Tháng 10', 11: 'Tháng 11', 12: 'Tháng 12'
      };

      // Sắp xếp các tháng theo thứ tự
      const labels = Object.keys(monthMap)
        .sort((a, b) => {
          const [ma, ya] = a.split("/").map(Number);
          const [mb, yb] = b.split("/").map(Number);
          return ya === yb ? ma - mb : ya - yb;
        })
        .map(month => {
          const [m] = month.split("/").map(Number);
          return monthNames[m];
        });

      const data = Object.keys(monthMap)
        .sort((a, b) => {
          const [ma, ya] = a.split("/").map(Number);
          const [mb, yb] = b.split("/").map(Number);
          return ya === yb ? ma - mb : ya - yb;
        })
        .map(month => monthMap[month]);

      setChartData({
        labels,
        datasets: [
          {
            label: "Số đơn hàng",
            data,
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            borderColor: "rgba(53, 162, 235, 1)",
            borderWidth: 1
          },
        ],
      });
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  }, [allInvoices]);

  return <Bar options={options} data={chartData} />;
} 