import React, { useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col, Button } from "reactstrap";
import "../styles/shop.css";
import products from "../assets/data/products";
import ProductsList from "../components/UI/ProductsList";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axiosConfig";
import ReactPaginate from "react-paginate";

const Shop = () => {
  const [productsData, setProductsData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("normal");
  const [asc, setAsc] = useState(1);
  const [productsSort, setProductsSort] = useState([]);
  const [check, setCheck] = useState(1);

  const pageProduct = async (page) => {
    try {
      console.log('Fetching products page:', page);
      const res = await axios.get(`/api/products/shop-products?page=${page}`);
      console.log('Products response:', res);
      if (res.data) {
        const { data, total_pages, total } = res.data;
        console.log('Page data:', { data, total_pages, total });
        setProductsData(data || []);
        setTotalPages(total_pages || 1);
      } else {
        console.warn('Invalid response format:', res.data);
        setProductsData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductsData([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    pageProduct(0);
  }, []);

  const handlePageChange = (e) => {
    pageProduct(e.selected);
  };

  const fetchSort = async () => {
    try {
      console.log('Fetching sorted products:', { sort, asc });
      const res = await axios.get(
        `/api/products/sort-products?page=0&sortBy=${sort}&asc=${asc}`
      );
      console.log('Sorted products response:', res);
      if (res.data) {
        const { data, total_pages } = res.data;
        setProductsSort(data || []);
        setTotalPages(total_pages || 1);
      } else {
        console.warn('Invalid response format:', res.data);
        setProductsSort([]);
      }
    } catch (error) {
      console.error('Error fetching sorted products:', error);
      setProductsSort([]);
    }
  };

  const handleSearch = (e) => {
    const searchText = e.target.value;
    const searchedValue = products.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setProductsData(searchedValue);
    if (check === 2) {
      const searchedValue = products.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setProductsSort(searchedValue);
    }
  };

  const handleClickSort = () => {
    setCheck(2);
    fetchSort();
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Products" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" style={{ display: "flex", gap: "20px" }}>
              <div className="filter__widget">
                <select
                  onChange={(e) => {
                    if (e.target.value === "normal") {
                      setCheck(1);
                      setSort(e.target.value);
                    } else {
                      setSort(e.target.value);
                    }
                  }}
                >
                  <option value="normal">Lọc theo: </option>
                  <option value="productPrice">Giá</option>
                </select>
              </div>
              <div className="filter__widget">
                <select
                  onChange={(e) => {
                    e.target.value === "asc" ? setAsc(1) : setAsc(2);
                  }}
                >
                  <option value="none">Sắp xếp:</option>
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>
              <Button
                className="filter__widget"
                style={{ width: "200px" }}
                onClick={handleClickSort}
              >
                Xác nhận
              </Button>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Tìm kiếm tên sản phẩm ..."
                  onChange={handleSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>



                  <section className="pt-0">
        <Container>
          <Row>
            {!productsData || productsData.length === 0 ? (
              <h1 className="text-center fs-4">
                Không tìm thấy sản phẩm! Có lỗi đã xảy ra vui lòng tải lại trang
              </h1>
            ) : check === 1 ? (
              <>
                <ProductsList data={productsData} />
                {totalPages > 1 && (
                  <div className="paginate-shop">
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
                      pageCount={Math.max(1, totalPages)}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName="pagination"
                      activeClassName="active"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <ProductsList data={productsSort} />
              </>
            )}
          </Row>
        </Container>
      </section>
      
    </Helmet>
  );
};

export default Shop;
