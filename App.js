// Import các thư viện cần thiết
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import './App.css'; // Import file CSS

// Redux Slice để quản lý trạng thái hàng hóa
const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
  },
  reducers: {
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    editProduct: (state, action) => {
      const { index, newData } = action.payload;
      state.items[index] = newData;
    },
    removeProduct: (state, action) => {
      state.items.splice(action.payload, 1);
    },
  },
});

const { addProduct, editProduct, removeProduct } = productSlice.actions;

// Thiết lập store của Redux
const store = configureStore({
  reducer: {
    product: productSlice.reducer,
  },
});

// Component AddProduct để thêm hàng hóa
function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && price) {
      dispatch(addProduct({ name, price }));
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Thêm Hàng Hóa</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên hàng hóa</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Giá hàng hóa</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Thêm hàng hóa</button>
      </form>
    </div>
  );
}

// Component EditProduct để chỉnh sửa hàng hóa
function EditProduct() {
  const { index } = useParams();
  const product = useSelector((state) => state.product.items[index]);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editProduct({ index, newData: { name, price } }));
    navigate('/');
  };

  return (
    <div>
      <h1>Chỉnh sửa hàng hóa</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên hàng hóa</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Giá hàng hóa</label>
          <input 
            type="number"value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
}

// Component ProductList để hiển thị danh sách hàng hóa
function ProductList() {
  const products = useSelector((state) => state.product.items);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRemove = (index) => {
    dispatch(removeProduct(index));
  };

  return (
    <div>
      <h1>Danh Sách Hàng Hóa</h1>
      <input 
        type="text" 
        placeholder="Tìm kiếm hàng hóa..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link to="/add-product">
        <button>Thêm Hàng Hóa</button>
      </Link>
      <ul>
        {displayedProducts.map((product, index) => (
          <li key={index}>
            {product.name} - {product.price} VND
            <button onClick={() => handleRemove(index)}>Xóa</button>
            <Link to={`/edit-product/${index}`}>
              <button>Chỉnh sửa</button>
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Trang trước
        </button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Trang sau
        </button>
      </div>
    </div>
  );
}

// Component App chính, chứa Router để điều hướng
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:index" element={<EditProduct />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;