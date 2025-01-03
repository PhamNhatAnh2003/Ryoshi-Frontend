import "./index.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Begin1_1 from "../../../../assets/images/begin1.1.png";
import Begin1_2 from "../../../../assets/images/begin1.2.png";
import Begin1_3 from "../../../../assets/images/begin1.3.png";
import Begin1_4 from "../../../../assets/images/begin1.4.png";
import Button from "../../../../components/button";
import BeginNavLink from "../../../../components/beginNavLink/beginNavLink";

function Begin2() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("authToken");
  const userId = JSON.parse(sessionStorage.getItem("auth")).id

  const [selectedItems, setSelectedItems] = useState([]);

  // const options = [
  //   "エコツーリズム",
  //   "文化旅行",
  //   "リゾート",
  //   "\n",
  //   "レクリエーション",
  //   "スポーツ",
  //   "探検",
  //   "冒険",
  //   "\n",
  //   "コンビネーション",
  //   "家族旅行",
  //   "団体旅行",
  //   "\n",
  //   "個人旅行",
  //   "ビーチ",
  //   "山",
  //   "都市",
  //   "田舎",
  // ];
 
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const fetchOptions = async () => {
      const options = await getTagsList();
      if (options) {
        setOptions(options);
      }
    };

    fetchOptions(); // Gọi hàm bất đồng bộ
  }, []);
  
  const rows = [];
  let currentRow = [];

  options.forEach((option, index) => {
    if (option === "リゾート" || option === "冒険" || option === "団体旅行") {
      // Nếu gặp ký tự xuống dòng, đẩy currentRow vào rows và reset currentRow
      currentRow.push(option);
      rows.push(currentRow);
      currentRow = []; // Reset currentRow
    } else {
      // Thêm option vào currentRow
      currentRow.push(option);
    }
  });

  // Đừng quên thêm currentRow còn lại nếu có
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const handleItemClick = (item) => {
    setSelectedItems((prevSelected) => {
      // Nếu chip đã được chọn, bỏ chọn
      if (prevSelected.includes(item)) {
        return prevSelected.filter((selectedItem) => selectedItem !== item);
      } else {
        // Nếu chip chưa được chọn, thêm vào danh sách
        return [...prevSelected, item];
      }
    });
  };

  const handleNextClick = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Tạo body cho yêu cầu API
    const body = {
      interest: selectedItems.toString()
    }

    try {
      // Gửi yêu cầu POST đến API
      const response = await fetch('http://localhost:8000/api/v1/users/' + userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Thêm Bearer Token vào header
        },
        body: JSON.stringify(body),
      });

      // Kiểm tra phản hồi từ server
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Nếu gửi thành công, chuyển đến trang tiếp theo
      if (selectedItems.length < 5) {
        alert("最低5つの項目を選択してください");
      } else {
        navigate("/user/home");
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className="begin1-container begin2">
      <div className="begin1-header">
        <h1 className="begin1-title">興味のある旅行のタイプを選択してください</h1>
        <BeginNavLink />
      </div> 
      <div className="flex-2cols">
        <div className="flex-col">
          <h2 className="begin1-title" style={{ marginTop: "10px" }}>(最低5つの項目を選択してください)</h2>

          <div className="begin1-content">
            {/* Phần form lựa chọn */}
            <div className="begin2-form-section">
              <div className="options-column full-height">
              {rows.map((row, rowIndex) => (
                <div className="options-row" key={rowIndex}>
                  {row.map((item, itemIndex) => (
                    <div
                      className={`chips-wrapper ${selectedItems.includes(item) ? 'selected' : ''}`}
                      onClick={() => handleItemClick(item)}
                      key={itemIndex}
                    >
                      <input
                        type="checkbox"
                        id={`itemIndex`} // Đảm bảo id là duy nhất
                        className="d-none"
                        checked={selectedItems.includes(item)}
                        readOnly
                      />
                      <label htmlFor={`checkbox-${rowIndex}-${itemIndex}`}>{item}</label>
                    </div>
                  ))}
                </div>
              ))}
                  
              </div>

              <Button label="探検を始めよう！" className="begin2-submit-button" onClick={handleNextClick}>
            </Button>
            <button className="begin-skip-button" onClick={() => navigate("/user/home")}>スキップこのステップ</button>
            </div>
          </div>
        </div>
        {/* Phần hình ảnh */}
        <div className="flex-item2">
          <div className="image-section">
              <img src={Begin1_1} className="begin1-image item-1" />
              <img src={Begin1_2} className="begin1-image item-2" />
              <img src={Begin1_3} className="begin1-image item-3" />
              <img src={Begin1_4} className="begin1-image item-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function getTagsList() {
  try {
    // Gửi yêu cầu POST đến API
    const response = await fetch('http://localhost:8000/api/v1/tags', {
      method: 'GET',
    });

    // Kiểm tra phản hồi từ server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Nếu gửi thành công, trả về danh sách
    return data.tags.flatMap(tag => {
      const cleanedName = tag.name.replace(/\n/g, ''); // Xóa tất cả \n
      const names = [cleanedName]; // Khởi tạo mảng với tên đã làm sạch
    
      // Nếu tag.name chứa \n, thêm một phần tử mới chứa \n
      if (tag.name.includes('\n')) {
        names.push('\n');
      }
    
      return names; // Trả về mảng các tên
    });
  } catch (error) {
    console.error('Có lỗi xảy ra khi gửi dữ liệu:', error);
    return null;
  }
}

export default Begin2;
