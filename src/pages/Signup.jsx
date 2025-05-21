import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signUp } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { DatePicker } from "reactstrap-date-picker";
import Loading from "../components/UI/Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState();
  const [fmtValue, setFmtValue] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Phone validation
    if (!phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    }

    // Address validation
    if (!address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    // Gender validation
    if (!gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    // Birth date validation
    if (!birth) {
      newErrors.birth = "Vui lòng chọn ngày sinh";
    } else {
      const selectedDate = new Date(birth);
      const currentDate = new Date();
      
      // Reset time part to compare only dates
      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      if (selectedDate >= currentDate) {
        newErrors.birth = "Ngày sinh phải trước ngày hiện tại";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (value, formattedValue) => {
    setBirth(value);
    setFmtValue(formattedValue);
    if (errors.birth) {
      setErrors({ ...errors, birth: "" });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const data = {
      username,
      email,
      password,
      phone,
      address,
      gender,
      birth: fmtValue,
    };
    
    try {
      const res = await dispatch(signUp(data)).unwrap();
      if (!res?.status) {
        toast.success("Đăng ký tài khoản thành công!");
        navigate("/login");
      } else {
        toast.error("Có lỗi khi đăng ký!");
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi khi đăng ký!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Helmet title="Signup">
      <section>
        <Container>
          <Row>
            {loading ? (
              <Loading />
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold fs-4 mb-4">Đăng ký</h3>
                <Form className="auth__form" onSubmit={handleSignup}>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Nhập username"
                      name="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) {
                          setErrors({ ...errors, username: "" });
                        }
                      }}
                    />
                    {errors.username && <div className="error-message">{errors.username}</div>}
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      type="email"
                      placeholder="Nhập email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors({ ...errors, email: "" });
                        }
                      }}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </FormGroup>

                  <FormGroup className="form__group">
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors({ ...errors, password: "" });
                          }
                        }}
                      />
                      <span 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    {errors.password && <div className="error-message">{errors.password}</div>}
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      type="number"
                      placeholder="Nhập số điện thoại"
                      name="phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) {
                          setErrors({ ...errors, phone: "" });
                        }
                      }}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Nhập Địa chỉ"
                      name="address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) {
                          setErrors({ ...errors, address: "" });
                        }
                      }}
                    />
                    {errors.address && <div className="error-message">{errors.address}</div>}
                  </FormGroup>

                  <FormGroup>
                    <label className="gender-label">Giới tính</label>
                    <div className="gender">
                      <div>
                        <input
                          type="radio"
                          name="gender"
                          value="Nam"
                          onChange={(e) => {
                            setGender(e.target.value);
                            if (errors.gender) {
                              setErrors({ ...errors, gender: "" });
                            }
                          }}
                        />
                        <label>Nam</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="gender"
                          value="Nữ"
                          onChange={(e) => {
                            setGender(e.target.value);
                            if (errors.gender) {
                              setErrors({ ...errors, gender: "" });
                            }
                          }}
                        />
                        <label>Nữ</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="gender"
                          value="Khác"
                          onChange={(e) => {
                            setGender(e.target.value);
                            if (errors.gender) {
                              setErrors({ ...errors, gender: "" });
                            }
                          }}
                        />
                        <label>Khác</label>
                      </div>
                    </div>
                    {errors.gender && <div className="error-message">{errors.gender}</div>}
                  </FormGroup>

                  <FormGroup>
                    <div className="datepick">
                      <label>Ngày sinh</label>
                      <DatePicker
                        placeholder="MM/DD/YYYY"
                        value={birth}
                        onChange={(v, f) => handleChange(v, f)}
                      />
                      {errors.birth && <div className="error-message">{errors.birth}</div>}
                    </div>
                  </FormGroup>

                  <button type="submit" className="buy__btn auth__btn">
                    Tạo tài khoản
                  </button>
                  <p>
                    Bạn đã có tài khoản?{" "}
                    <Link to="/login">Đăng nhập ngay!</Link>
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

export default Signup;
