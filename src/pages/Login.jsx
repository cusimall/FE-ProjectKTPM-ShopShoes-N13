import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import Loading from "../components/UI/Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth?.loading);

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }
    
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hanleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const data = {
      username,
      password,
    };
    try {
      const res = await dispatch(signIn(data)).unwrap();
      console.log('Login response:', res);
      
      // Kiểm tra token từ localStorage
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        throw new Error('Không nhận được token sau khi đăng nhập');
      }

      // Kiểm tra role từ response
      const roles = res.roles || [];
      console.log('User roles:', roles);
      
      if (roles.includes('ROLE_ADMIN')) {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
      
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      console.error('Login error:', error);
      
      // Hiển thị thông báo lỗi chung cho tất cả các trường hợp
      toast.error("Tài khoản hoặc mật khẩu không chính xác");
    }
  };

  return (
    <Helmet title="Login">
      <section>
        <Container>
          <Row>
            {loading ? (
              <Loading />
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold fs-4 mb-4">Đăng nhập</h3>
                <Form className="auth__form" onSubmit={hanleLogin}>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Nhập username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrors({...errors, username: ''});
                      }}
                      className={errors.username ? 'is-invalid' : ''}
                    />
                    {errors.username && (
                      <div className="invalid-feedback d-block text-start">
                        {errors.username}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="form__group">
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors({...errors, password: ''});
                        }}
                        className={errors.password ? 'is-invalid' : ''}
                      />
                      <span 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block text-start">
                        {errors.password}
                      </div>
                    )}
                  </FormGroup>
                  <button type="submit" className="buy__btn auth__btn">
                    Đăng Nhập
                  </button>
                  <p>
                    Chưa có tài khoản? <Link to="/signup">Tạo tài khoản</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
