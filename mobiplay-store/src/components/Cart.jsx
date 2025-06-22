import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from '../store/cartSlice';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../components/ThemeContext';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(state => state.cart.items);
  const { darkMode } = useContext(ThemeContext);

  // حساب المجموع الكلي للسلة
  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  // عرض واجهة السلة الفارغة
  if (cartItems.length === 0) {
    return (
      <div
        style={{
          minHeight: '60vh',
          backgroundColor: darkMode ? '#2e1f4f' : '#f8f9fa',
          color: darkMode ? '#dcd6f7' : '#212529',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          borderRadius: '12px',
          marginTop: '2rem',
          boxShadow: darkMode ? '0 0 15px rgba(187,134,252,0.6)' : 'none',
        }}
      >
        <FaShoppingCart
          size={50}
          color={darkMode ? '#bb86fc' : '#0d6efd'}
          style={{ marginBottom: '1rem' }}
        />
        <h4>Your cart is empty.</h4>
        {/* زر للعودة إلى صفحة المنتجات */}
        <button
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: darkMode ? '#7a59d1' : '#0d6efd',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/products')}
        >
          ← Continue Shopping
        </button>
      </div>
    );
  }

  // عرض السلة مع العناصر
  return (
    <div
      style={{
        minHeight: '70vh',
        backgroundColor: darkMode ? '#2e1f4f' : '#ffffff',
        color: darkMode ? '#e0dffb' : '#212529',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '900px',
        margin: '2rem auto',
        boxShadow: darkMode
          ? '0 0 20px rgba(187,134,252,0.7)'
          : '0 0 15px rgba(0,0,0,0.1)',
      }}
    >
      {/* عنوان الصفحة */}
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '700',
          fontSize: '1.8rem',
          color: darkMode ? '#bb86fc' : '#0d6efd',
          marginBottom: '1.5rem',
        }}
      >
        <FaShoppingCart />
        Your Cart
      </h2>

      {/* قائمة العناصر */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {cartItems.map(item => (
          <li
            key={item.id}
            style={{
              backgroundColor: darkMode ? '#503a81' : '#f8f9fa',
              color: darkMode ? '#e0dffb' : '#212529',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: darkMode
                ? '0 4px 15px rgba(187,134,252,0.5)'
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* بيانات العنصر */}
            <div>
              <strong>{item.name}</strong> × {item.quantity}
              {/* أزرار زيادة/نقص الكمية */}
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => dispatch(decreaseQuantity(item.id))}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    border: '1px solid #6c757d',
                    backgroundColor: darkMode ? '#fff' : '#6c757d',
                    color: darkMode ? '#000' : '#fff',
                    fontWeight: '700',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <button
                  onClick={() => dispatch(increaseQuantity(item.id))}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    border: '1px solid #6c757d',
                    backgroundColor: darkMode ? '#fff' : '#6c757d',
                    color: darkMode ? '#000' : '#fff',
                    fontWeight: '700',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* السعر الإجمالي وزر الحذف */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
            </div>
          </li>
        ))}

        {/* المجموع النهائي */}
        <li
          style={{
            backgroundColor: darkMode ? '#593a9c' : '#f1f1f1',
            color: darkMode ? '#ddd' : '#212529',
            padding: '1rem',
            borderRadius: '10px',
            fontWeight: '700',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1.5rem',
            boxShadow: darkMode
              ? '0 4px 20px rgba(187,134,252,0.8)'
              : '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span>Total:</span>
          <span>${getTotal()}</span>
        </li>
      </ul>

      {/* زر المتابعة لصفحة الدفع */}
      <button
        onClick={() => navigate('/checkout')}
        style={{
          marginTop: '1.5rem',
          width: '100%',
          padding: '0.75rem',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: darkMode ? '#7a59d1' : '#0d6efd',
          color: '#fff',
          fontWeight: '700',
          cursor: 'pointer',
        }}
      >
        Proceed to Checkout
      </button>

      {/* زر حذف كل العناصر */}
      <button
        onClick={() => dispatch(clearCart())}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '0.75rem',
          borderRadius: '10px',
          border: darkMode ? '2px solid #dc3545' : 'none',
          backgroundColor: darkMode ? '#dc3545' : '#ffc107',
          color: darkMode ? '#fff' : '#212529',
          fontWeight: '700',
          cursor: 'pointer',
        }}
      >
        Clear Cart
      </button>

      {/* زر الرجوع إلى المنتجات */}
      <button
        onClick={() => navigate('/products')}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '0.75rem',
          borderRadius: '10px',
          border: '2px solid',
          borderColor: darkMode ? '#7a59d1' : '#0d6efd',
          backgroundColor: 'transparent',
          color: darkMode ? '#d1b3ff' : '#0d6efd',
          fontWeight: '700',
          cursor: 'pointer',
        }}
      >
        ← Continue Shopping
      </button>
    </div>
  );
}

export default Cart;
