import "./index.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../assets/images/background.png";
import registerQuote from "../../../assets/images/register_quote.png";
import ryoshi from "../../../assets/images/ryoshi.png";
import registerImage from "../../../assets/images/image2.png";
import Button from "../../../components/button";
import Input from "../../../components/input";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    email: "",
    password1: "",
    password2: ""
  });

  const [mailError, setMailError] = useState('');
  const [pass1Error, setPass1Error] = useState('');
  const [pass2Error, setPass2Error] = useState('');

  const validateEmail = (email) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleMailChange = (e) => {
    const email = e.target.value;
    setValues({ ...values, email });

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
      setMailError('無効なメールです!'); // Thiết lập thông báo lỗi
    } else {
      setMailError(''); // Xóa thông báo lỗi nếu định dạng hợp lệ
    }
  };

  const handlePass1Change = (e) => {
    const password = e.target.value;
    setValues({ ...values, password1: password }); // Cập nhật trường password1

    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,20}$/;
    if (!passwordRequirements.test(values.password1)) {
        setPass1Error('パスワードは、少なくとも1つの大文字、1つの数字、1つの特殊文字を含み、6〜20文字でなければなりません！');
        return;
    } else {
      setPass1Error(''); // Xóa thông báo lỗi nếu giống nhau
    } 
  };

  const handlePass2Change = (e) => {
    const password2 = e.target.value;
    setValues({ ...values, password2 });
  };

  const handleFinish = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    if (values.password1.length === 0) {
      setPass1Error('パスワードを入力してください！'); // Thông báo lỗi nếu không nhập
      return;
    }   
    const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,20}$/;
    if (!passwordRequirements.test(values.password1)) {
        setPass1Error('パスワードは、少なくとも1つの大文字、1つの数字、1つの特殊文字を含み、6〜20文字でなければなりません！');
        return;
    } else {
      setPass1Error(''); // Xóa thông báo lỗi nếu giống nhau
    } 

    // Kiểm tra xem password1 và password2 có giống nhau không
    if (values.password2 !== values.password1) {
      setPass2Error('再入力したパスワードが間違っています'); // Thiết lập thông báo lỗi
      return;
    } else {
        setPass2Error(''); // Xóa thông báo lỗi nếu giống nhau
    }

    try {
      console.log(values.email);
      const response = await axios.post("http://localhost:8000/api/v1/register", {
        email: values.email,
        password: values.password2,
      });

      // Xử lý khi đăng nhập thành công
    if (response.status === 200) {
      toast.success(response.data.message);
      sessionStorage.setItem("authToken", response.data.token);
      //Xử lý token
      const parts = response.data.token.split('.'); // Tách token thành 3 phần
      const payload = parts[1];
      const decodedPayload = JSON.parse(atob(payload)); // Giải mã Base64
      
      sessionStorage.setItem("auth", JSON.stringify(decodedPayload));
      setTimeout(() => {
        navigate("/user/begin1");
      }, 3000);
    }
  } catch (error) {
    // Xử lý lỗi từ server
    console.log(error.response.data.error);
    toast.error(error.response.data.error)
  }
  };

  return (
    <div
      className="register-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="register-wrap">
        <div className="register-wrap-img">
          <img src={registerImage} className="login-image1" />
          <img src={ryoshi} className="login-image2" />
        </div>
        <div className="login-images-bottom">
          <img
            src={registerQuote}
            alt="Register Bottom Image"
            className="login-image"
          />
        </div>

        <form className="login-form-item-mobile">
          <div>
            <Input
              type="text"
              className=""
              placeholder="メール"
              icon={<MailOutlined />}
              value={values.email}
              onChange={handleMailChange}
            />
            <div className="explain-error">
              {mailError || <span>&nbsp;</span>} 
            </div>
          </div>

          <div>
            <Input
              type="password"
              className=""
              placeholder="パスワード"
              icon={<LockOutlined />} 
              value={values.password1}
              onChange={handlePass1Change}
            />
            <div className="explain-error">
              {pass1Error || <span>&nbsp;</span>} 
            </div>
          </div>

          <div>
          <Input
              type="password"
              className=""
              placeholder="パスワードを確認する"
              icon={<LockOutlined />} 
              value={values.password2}
              onChange={handlePass2Change}
              />
            <div className="explain-error">
              {pass2Error || <span>&nbsp;</span>} 
            </div>
          </div>

          <Button label="登録" className="login-btn-regis" onClick={handleFinish}>
          </Button>

        </form>
        <div className="flex-full-width">
          <div className="login-to-register-to-forgotpassword justi-center">
            <Link className="register-link underline" to="/login">
              アカウントがあった？
            </Link>
          </div>
        </div>

        <div className="other-login-methods">
          <div className="other-login-text">他の方法</div>
          <div className="social-icons">
            <button className="social-button google">
              <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button className="social-button facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </button>
            <button className="social-button twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;