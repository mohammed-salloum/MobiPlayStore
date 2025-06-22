import React, { useState, useContext } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";  // أيقونة تويتر (X)
import { ThemeContext } from "./ThemeContext";

function Contact() {
  const { darkMode } = useContext(ThemeContext);

  // حالة النموذج لتخزين البيانات المدخلة من المستخدم
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // تحديث بيانات النموذج عند تغيّر أي حقل
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // معالجة إرسال النموذج (هنا مجرد تنبيه وإعادة تعيين الحقول)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mt-5">
      {/* أنماط CSS مدمجة تتغير حسب الوضع الداكن */}
      <style>{`
        .contact-info {
          background: ${darkMode ? "#222" : "#fff"};
          box-shadow: ${
            darkMode
              ? "0 0 10px rgba(255,255,255,0.05)"
              : "0 0 10px rgba(0,0,0,0.1)"
          };
          padding: 25px;
          border-radius: 10px;
          height: 100%;
          color: ${darkMode ? "#ddd" : "#000"};
        }

        .contact-info .info-label {
          font-weight: 600;
          color: ${darkMode ? "#bbb" : "#333"};
        }

        .contact-info .info-value {
          color: ${darkMode ? "#eee" : "#111"};
          font-size: 0.95rem;
        }

        .icon-dark {
          color: ${darkMode ? "#b399f7" : "#0d6efd"};
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .social-icons a {
          transition: all 0.3s ease;
          color: inherit;
        }

        .social-icons a:hover {
          color: #0d6efd !important;
          transform: scale(1.2);
        }

        .btn-primary {
          background-color: ${darkMode ? "#7a59d1" : "#0d6efd"};
          border-color: ${darkMode ? "#7a59d1" : "#0d6efd"};
          color: white;
          font-weight: 600;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-primary:hover {
          background-color: ${darkMode ? "#9c7ef4" : "#0b5ed7"};
          box-shadow: ${
            darkMode
              ? "0 0 12px rgba(122, 89, 209, 0.6)"
              : "0 0 12px rgba(13,110,253,0.6)"
          };
        }

        .form-control {
          background-color: ${darkMode ? "#2b2b2b" : "#fff"};
          color: ${darkMode ? "#eee" : "#000"};
          border: 1px solid ${darkMode ? "#444" : "#ced4da"};
          transition: box-shadow 0.3s ease, border 0.3s ease;
        }

        .form-control:focus {
          box-shadow: 0 0 8px rgba(13, 110, 253, 0.5);
          border-color: #0d6efd;
          background-color: ${darkMode ? "#333" : "#fff"};
          color: ${darkMode ? "#fff" : "#000"};
        }

        .form-control::placeholder {
          color: ${darkMode ? "#aaa" : "#6c757d"};
          opacity: 1;
        }

        .header-icon {
          color: ${darkMode ? "#b399f7" : "#0d6efd"};
          margin-right: 8px;
        }

        @media (max-width: 767px) {
          .contact-info,
          .contact-form {
            padding: 15px !important;
          }
        }
      `}</style>

      <div
        className={`row shadow rounded p-4 ${
          darkMode ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        {/* قسم معلومات الاتصال */}
        <div className="col-md-5 contact-info d-flex flex-column justify-content-center">
          <h3 className="mb-4 fw-bold border-bottom pb-2 d-flex align-items-center">
            <span className="header-icon" role="img" aria-label="contact">
              📬
            </span>
            Contact Information
          </h3>

          {/* البريد الإلكتروني */}
          <div className="d-flex align-items-start gap-3 mb-3">
            <FaEnvelope size={20} className="icon-dark" />
            <div>
              <div className="info-label">Email</div>
              <div className="info-value">support@mobiplaystore.com</div>
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="d-flex align-items-start gap-3 mb-3">
            <FaPhone size={20} className="icon-dark" />
            <div>
              <div className="info-label">Phone</div>
              <div className="info-value">+ (963) 944 123 456</div>
            </div>
          </div>

          <div
            className="mt-4 mb-3"
            style={{ fontSize: "0.95rem", color: darkMode ? "#ccc" : "#555" }}
          >
            We’d love to hear from you! Fill out the form and we’ll get in touch
            as soon as possible.
          </div>

          {/* روابط وسائل التواصل الاجتماعي */}
          <h6 className="mt-4 fw-bold d-flex align-items-center">
            <span className="header-icon" role="img" aria-label="send message">
              📨
            </span>
            Follow us:
          </h6>
          <div className="d-flex gap-3 mt-2 social-icons">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className={darkMode ? "text-light" : "text-dark"}
              title="Twitter/X"
            >
              <FaXTwitter size={22} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary"
              title="Facebook"
            >
              <FaFacebookF size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-danger"
              title="Instagram"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary"
              title="LinkedIn"
            >
              <FaLinkedinIn size={22} />
            </a>
          </div>
        </div>

        {/* نموذج التواصل */}
        <div className="col-md-7 mt-4 mt-md-0 contact-form">
          <h4 className="mb-4 fw-bold d-flex align-items-center">
            <span className="header-icon" role="img" aria-label="send message">
              📨
            </span>
            Send Us a Message
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                aria-label="Name"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                aria-label="Email"
              />
            </div>
            <div className="mb-4">
              <textarea
                name="message"
                rows="5"
                className="form-control"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                aria-label="Message"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
