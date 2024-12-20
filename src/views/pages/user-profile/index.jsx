import React, { useState, useEffect } from "react";
import UploadProfile from "../../../components/uploadProfile";
import Button from "../../../components/button";
import {
  faThumbsUp,
  faHeart,
  faPersonHiking,
  faCircleCheck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button as AntdButton, Input } from "antd";
import axios from "axios";
import Collection from "../../../components/collection";
import "./index.css";

const UserProfile = () => {
  const [hobbies, setHobbies] = useState([]); // Danh sách sở thích
  const [newHobby, setNewHobby] = useState(""); // Giá trị của sở thích mới
  const [isHobbyFormVisible, setHobbyFormVisible] = useState(false); // Trạng thái hiển thị form
  const [collections, setCollections] = useState([]); // Dữ liệu từ API
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "HelloH",
    birthday: "2010年10月21日",
    phone: "0911345677",
    email: "abc@gmail.com",
    location: "HaNoi",
  });

  const handleToggleButtons = () => {
    setIsButtonVisible(!isButtonVisible);
    setIsEditing(!isEditing); // Bật/tắt chế độ chỉnh sửa
  };

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm xử lý thêm sở thích
  const handleAddHobby = () => {
    if (newHobby.trim() !== "") {
      setHobbies([...hobbies, newHobby]); // Thêm sở thích mới vào danh sách
      setNewHobby(""); // Reset input
    }
  };

  const handleInputChange = (e) => {
    setNewHobby(e.target.value);
  };

  // Hàm xử lý hiển thị form
  const toggleHobbyForm = () => {
    setHobbyFormVisible(!isHobbyFormVisible); // Chuyển trạng thái ẩn/hiện
  };
  const fetchPlaces = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:8000/api/v1/locations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { location } = response.data;
        setCollections(location); // Lưu danh sách địa điểm vào state
      } else {
        console.error("Error fetching locations:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching places:",
        error.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <div className="user-profile">
      <h1 className="title-user-head">プロフィール</h1>
      <div className="user-profile-wrap">
        <div className="user-profile-image">
          <UploadProfile />
        </div>
        <div className="user-profile-info">
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/Vector.png")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">名前：</span>
            {isEditing ? (
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.name}</span>
            )}
          </div>
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/birthday.jpg")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">生年月日：</span>
            {isEditing ? (
              <Input
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.birthday}</span>
            )}
          </div>
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/phone.jpg")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">電話番号：</span>
            {isEditing ? (
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.phone}</span>
            )}
          </div>
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/mail.jpg")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">メール：</span>
            {isEditing ? (
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.email}</span>
            )}
          </div>
          <div className="user-profile-info-item">
            <img
              src={require("../../../assets/images/Vector3.png")}
              alt="Icon"
              className="info-icon"
            />
            <span className="font-bold">場所：</span>
            {isEditing ? (
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="ml-2">{formData.location}</span>
            )}
          </div>
        </div>
        <div className="user-profile-button">
          <Button
            label="編集"
            className="user-button"
            type="user-submit"
            onClick={handleToggleButtons}
          ></Button>
        </div>
      </div>
      <div className="user-hobby">
        <label className="title-user">
          <FontAwesomeIcon icon={faThumbsUp} className="color-icon" />
          趣味
        </label>
        <div className="user-hobby-button">
          {/* Các nút mặc định */}
          <Button
            label="エコツーリズム"
            className="user-button-hobby"
            type="user-submit-hobby"
          ></Button>
          <Button
            label="文化旅行"
            className="user-button-hobby"
            type="user-submit-hobby"
          ></Button>
          <Button
            label="リンート"
            className="user-button-hobby"
            type="user-submit-hobby"
          ></Button>
          {/* Danh sách sở thích */}
          {hobbies.map((hobby, index) => (
            <Button
              key={index}
              label={hobby}
              className="user-button-hobby"
              type="user-submit-hobby"
            ></Button>
          ))}
          {/* Nút thêm sở thích */}
          <Button
            label="+"
            className="user-button-addhobby"
            type="user-submit-addhobby"
            onClick={toggleHobbyForm} // Xử lý hiển thị form
          ></Button>
        </div>

        {/* Form nhập sở thích */}
        {isHobbyFormVisible && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Input
              value={newHobby}
              onChange={handleInputChange}
              placeholder="Enter a new hobby"
              className="user-input-hobby"
            />
            <AntdButton type="primary" onClick={handleAddHobby}>
              Add
            </AntdButton>
          </div>
        )}
      </div>
      <div class="favoritelocation">
        <label className="favarite-title">
          <FontAwesomeIcon icon={faHeart} className="color-icon" />
          好きな場所
        </label>
        <Collection
          collectionData={collections}
          itemsNumber={4}
          showIndicator={false}
          showPagination={false}
          rowNumber={1}
        ></Collection>
      </div>
      <div class="gonelocation">
        <label className="gone-title">
          <FontAwesomeIcon icon={faPersonHiking} className="color-icon" />
          訪れた場所
        </label>
        <Collection
          collectionData={collections}
          itemsNumber={4}
          showIndicator={false}
          showPagination={false}
          rowNumber={1}
        ></Collection>
      </div>
      <div className="user-button">
        {!isButtonVisible && (
          <div style={{ display: "flex" }}>
            <div className="user-button-edit">
              <Button
                label={
                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} /> 保存
                  </div>
                }
                className="user-button-editsave1"
                type="user-submit"
              ></Button>
            </div>
            <div className="user-button-edit">
              <Button
                label={
                  <div>
                    <FontAwesomeIcon icon={faX} /> キャンセル
                  </div>
                }
                className="user-button-editsave2"
                type="user-submit"
              ></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;