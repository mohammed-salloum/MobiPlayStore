import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { ThemeContext } from '../components/ThemeContext';
import Select from 'react-select';

function Checkout() {
  const dispatch = useDispatch(); // لتشغيل الأفعال في Redux مثل إفراغ السلة
  const navigate = useNavigate(); // للتنقل بين صفحات التطبيق
  const cartItems = useSelector(state => state.cart.items); // جلب عناصر السلة من الـ Redux store
  const { darkMode } = useContext(ThemeContext); // قراءة حالة الثيم (داكن/فاتح) من السياق

  // خيارات طرق الدفع المدعومة
  const paymentOptions = [
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
  ];

  // حالة النموذج التي تخزن بيانات المستخدم
  const [formData, setFormData] = useState({
    name: '', // الاسم الكامل
    email: '', // البريد الإلكتروني
    address: '', // عنوان الشحن
    paymentMethod: paymentOptions[0], // طريقة الدفع الافتراضية (كريدت كارد)
  });

  // حالة التحميل أثناء معالجة الدفع
  const [loading, setLoading] = useState(false);

  // حساب إجمالي سعر السلة بدقة رقمين عشريين
  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // تحديث قيم حقول النصوص في النموذج
  const handleChangeInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // تحديث اختيار طريقة الدفع من مكون react-select
  const handleChangePayment = (selectedOption) => {
    setFormData({ ...formData, paymentMethod: selectedOption });
  };

  // معالجة إرسال النموذج
  const handleSubmit = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    setLoading(true); // تفعيل حالة التحميل

    // محاكاة طلب API أو معالجة الدفع
    setTimeout(() => {
      alert('🎉 Thank you for your purchase!'); // رسالة شكر
      dispatch(clearCart()); // إفراغ السلة بعد الدفع
      navigate('/'); // إعادة التوجيه للصفحة الرئيسية
    }, 1500);
  };

  // عرض رسالة في حال كانت السلة فارغة
  if (cartItems.length === 0) {
    return (
      <p className={`container mt-5 text-center ${darkMode ? 'text-gray-300' : ''}`}>
        Your cart is empty. Please add items before checkout.
      </p>
    );
  }

  // أنماط مخصصة لمكون react-select لتتناسب مع الثيم
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: darkMode ? '#2a2a3d' : '#fff',
      borderColor: state.isFocused ? (darkMode ? '#bb86fc' : '#4e73df') : (darkMode ? '#555' : '#ced4da'),
      boxShadow: state.isFocused ? (darkMode ? '0 0 8px #bb86fc' : '0 0 8px #4e73df') : 'none',
      borderRadius: 6,
      color: darkMode ? '#eee' : '#000',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '48px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: darkMode ? '#eee' : '#000',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: darkMode ? '#3e2a70' : '#cce4ff',
      borderRadius: 6,
      marginTop: 4,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? (darkMode ? '#7a59d1' : '#4e73df')
        : (darkMode ? '#3e2a70' : '#cce4ff'),
      color: state.isFocused ? '#fff' : (darkMode ? '#eee' : '#000'),
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: darkMode ? '#eee' : '#000',
      '&:hover': {
        color: darkMode ? '#bb86fc' : '#4e73df',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: darkMode ? 'rgba(255,255,255,0.5)' : '#6c757d',
    }),
  };

  return (
    <>
      {/* أنماط عامة للثيم */}
      <style>{`
        body {
          background-color: ${darkMode ? '#121212' : '#fff'};
          transition: background-color 0.3s ease;
        }
        input, textarea {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
          border-radius: 6px;
        }
        input::placeholder,
        textarea::placeholder {
          color: ${darkMode ? 'rgba(255, 255, 255, 0.5)' : '#6c757d'};
          opacity: 1;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: ${darkMode ? '#bb86fc' : '#4e73df'};
          box-shadow: 0 0 8px ${darkMode ? '#bb86fc' : '#4e73df'};
          background-color: ${darkMode ? '#1e1e2f' : '#fff'};
          color: ${darkMode ? '#eee' : '#000'};
        }

        .total-amount {
          font-weight: 700;
          color: ${darkMode ? '#bb86fc' : '#4e73df'};
        }

        .card {
          border-radius: 12px;
          box-shadow: ${darkMode
            ? '0 4px 20px rgba(187, 134, 252, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)'};
          background-color: ${darkMode ? '#1f1f2e' : '#fff'};
          color: ${darkMode ? '#ddd' : '#000'};
          transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
          padding: 24px;
        }
        .list-group-item {
          border: none;
          background-color: ${darkMode ? '#2a2a3d' : '#fff'};
          color: ${darkMode ? '#ccc' : '#000'};
          margin-bottom: 10px;
          border-radius: 8px;
          box-shadow: ${darkMode
            ? 'inset 0 0 5px rgba(255,255,255,0.05)'
            : 'none'};
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          transition: background-color 0.3s ease;
        }
        .list-group-item strong {
          color: ${darkMode ? '#fff' : '#000'};
        }
        button {
          border-radius: 8px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .btn-success {
          background-color: ${darkMode ? '#bb86fc' : '#28a745'};
          border-color: ${darkMode ? '#bb86fc' : '#28a745'};
          color: #fff;
        }
        .btn-success:hover {
          background-color: ${darkMode ? '#9f6efc' : '#218838'};
          border-color: ${darkMode ? '#9f6efc' : '#218838'};
        }
        .btn-outline-secondary {
          color: ${darkMode ? '#bbb' : '#6c757d'};
          border-color: ${darkMode ? '#bbb' : '#6c757d'};
        }
        .btn-outline-secondary:hover {
          background-color: ${darkMode ? '#444' : '#e2e6ea'};
          color: ${darkMode ? '#fff' : '#000'};
        }
        img.rounded {
          background-color: #fff;
          border-radius: 8px;
          padding: 2px;
          height: 50px;
          width: 50px;
          object-fit: cover;
        }
      `}</style>

      {/* محتوى الصفحة */}
      <div className={`container my-5`}>
        <h2 className={`mb-4 text-center fw-bold ${darkMode ? 'text-gray-100' : ''}`}>Checkout</h2>
        <div className="row g-4">

          {/* قسم ملخص الطلب */}
          <div className="col-md-5">
            <div className="card">
              <h4 className="mb-3 border-bottom pb-2">Order Summary</h4>
              <ul className="list-group mb-4">
                {cartItems.map(item => (
                  <li key={item.id} className="list-group-item">
                    <div className="d-flex align-items-center">
                      {/* عرض صورة المنتج إن وجدت */}
                      {item.img && (
                        <img src={item.img} alt={item.name} className="me-3 rounded" />
                      )}
                      <div>
                        <strong>{item.name}</strong> × {item.quantity}
                      </div>
                    </div>
                    <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
                {/* إجمالي السعر */}
                <li className="list-group-item" style={{ justifyContent: 'space-between' }}>
                  <span>Total</span>
                  <span className="total-amount">${getTotal()}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* قسم نموذج الدفع */}
          <div className="col-md-7">
            <div className="card">
              <h4 className="mb-3 border-bottom pb-2">Payment Details</h4>
              <form onSubmit={handleSubmit} noValidate>
                {/* حقل الاسم الكامل */}
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="name" className={`form-label fw-semibold ${darkMode ? 'text-gray-100' : ''}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${darkMode ? 'bg-[#2a2a3d] text-gray-100 border-gray-600' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChangeInput}
                      placeholder="Mohammed Salloum"
                      required
                    />
                  </div>

                  {/* حقل البريد الإلكتروني */}
                  <div className="mb-3 col-md-6">
                    <label htmlFor="email" className={`form-label fw-semibold ${darkMode ? 'text-gray-100' : ''}`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${darkMode ? 'bg-[#2a2a3d] text-gray-100 border-gray-600' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChangeInput}
                      placeholder="example@example.com"
                      required
                    />
                  </div>
                </div>

                {/* حقل العنوان */}
                <div className="mb-3">
                  <label htmlFor="address" className={`form-label fw-semibold ${darkMode ? 'text-gray-100' : ''}`}>
                    Shipping Address
                  </label>
                  <textarea
                    className={`form-control form-control-lg ${darkMode ? 'bg-[#2a2a3d] text-gray-100 border-gray-600' : ''}`}
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChangeInput}
                    placeholder="123 Main Street, City, Country"
                    required
                  />
                </div>

                {/* اختيار طريقة الدفع */}
                <div className="mb-4">
                  <label htmlFor="paymentMethod" className={`form-label fw-semibold ${darkMode ? 'text-gray-100' : ''}`}>
                    Payment Method
                  </label>
                  <Select
                    options={paymentOptions}
                    value={formData.paymentMethod}
                    onChange={handleChangePayment}
                    styles={customSelectStyles}
                    isSearchable={false}
                    name="paymentMethod"
                    classNamePrefix="react-select"
                    placeholder="Select payment method"
                  />
                </div>

                {/* زر تأكيد الدفع */}
                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100 shadow"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (
                    <>
                      <FaCheckCircle className="me-2" />
                      Confirm Payment
                    </>
                  )}
                </button>

                {/* زر العودة للسلة */}
                <button
                  type="button"
                  className={`btn btn-outline-secondary mt-3 w-100 ${darkMode ? 'btn-outline-light' : ''}`}
                  onClick={() => navigate('/cart')}
                  disabled={loading}
                >
                  ← Back to Cart
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Checkout;
