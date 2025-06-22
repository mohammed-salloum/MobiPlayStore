import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaLock, FaGamepad } from 'react-icons/fa';
import homeImage from '../assets/home.PNG';
import { ThemeContext } from './ThemeContext';

function Home() {
  const { darkMode } = useContext(ThemeContext); // جلب حالة الوضع الداكن من الـ Context

  return (
    <>
      <style>{`
        .card:hover {
          box-shadow: ${
            darkMode
              ? '0 0 15px 3px rgba(187, 134, 252, 0.7)'
              : '0 0 15px 3px rgba(0, 123, 255, 0.4)'
          };
          transition: box-shadow 0.3s ease;
        }
        .icon-primary {
          color: ${darkMode ? '#bb86fc' : '#0d6efd'};
          transition: color 0.3s ease;
        }
        footer {
          background-color: ${darkMode ? '#121212' : '#212529'};
          box-shadow: inset 0 1px 3px rgba(255,255,255,0.05);
        }
        .btn-browse {
          background-color: ${darkMode ? '#7a59d1' : '#0d6efd'};
          color: #fff;
          box-shadow: ${darkMode ? '0 0 15px #7a59d1' : '0 0 10px #0d6efd'};
          border: none;
          font-weight: 600;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-browse:hover {
          background-color: ${darkMode ? '#9c7ef4' : '#0056b3'};
          box-shadow: ${darkMode ? '0 0 20px #9c7ef4' : '0 0 15px #0056b3'};
        }
      `}</style>

      <main>
        {/* قسم الهيدر مع صورة خلفية وترحيب */}
        <header
          className="d-flex flex-column justify-content-center align-items-center text-center position-relative"
          style={{
            minHeight: '100vh',
            backgroundImage: `url(${homeImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
          }}
        >
          {/* طبقة شفافة فوق الصورة حسب المود */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: darkMode
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(255, 255, 255, 0.25)',
              zIndex: 0,
            }}
          />

          <div style={{ zIndex: 1, maxWidth: '700px', padding: '1rem' }}>
            <h1
              className="fw-bold mb-3"
              style={{
                fontSize: '2.5rem',
                whiteSpace: 'nowrap',
                color: darkMode ? '#ffffff' : '#000000',
              }}
            >
              Welcome to MobiPlayStore
            </h1>

            <p
              className="lead fs-5 mb-4"
              style={{
                color: darkMode ? '#e0e0e0' : '#1a1a1a',
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              Buy top-up cards for the most popular mobile games
            </p>

            {/* 🔹 زر استعراض المنتجات */}
            <Link to="/products" className="btn btn-browse btn-lg shadow">
              Explore Game Cards
            </Link>
          </div>
        </header>

        {/* قسم الميزات الرئيسية للموقع */}
        <section className={`container my-5 ${darkMode ? 'text-light' : ''}`}>
          <h2 className="text-center mb-5 fw-bold">Why Choose MobiPlayStore?</h2>
          <div className="row text-center gx-4 gy-4">
            <div className="col-md-4">
              <div
                className={`card shadow-sm h-100 border-0 rounded-3 ${
                  darkMode ? 'bg-dark text-light' : ''
                }`}
              >
                <div className="card-body">
                  <FaRocket size={48} className="icon-primary mb-3" />
                  <h5 className="card-title mb-3">Fast Delivery</h5>
                  <p className="card-text fs-6">
                    Instant codes delivered immediately after purchase, no waiting!
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className={`card shadow-sm h-100 border-0 rounded-3 ${
                  darkMode ? 'bg-dark text-light' : ''
                }`}
              >
                <div className="card-body">
                  <FaLock size={48} className="icon-primary mb-3" />
                  <h5 className="card-title mb-3">Secure Payment</h5>
                  <p className="card-text fs-6">
                    We use the latest security standards to protect your transactions.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className={`card shadow-sm h-100 border-0 rounded-3 ${
                  darkMode ? 'bg-dark text-light' : ''
                }`}
              >
                <div className="card-body">
                  <FaGamepad size={48} className="icon-primary mb-3" />
                  <h5 className="card-title mb-3">Wide Game Selection</h5>
                  <p className="card-text fs-6">
                    Top-up cards for PUBG, Free Fire, Call of Duty Mobile, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* الفوتر */}
        <footer className="text-white text-center py-3 mt-5">
          <p className="mb-0">© 2025 MobiPlayStore. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}

export default Home;
