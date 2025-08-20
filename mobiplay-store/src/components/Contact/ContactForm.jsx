import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import Button from "../common/Button"; // استيراد المكون العام
import { ThemeContext } from "../../context/ThemeContext"; // للوضع الداكن
import './ContactForm.css';

function ContactForm({ iconColor }) {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext); // الحصول على حالة الداكن
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    subject: "",
    question: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t("contact.form.alert")); // رسالة التنبيه
    setForm({
      name: "",
      phone: "",
      email: "",
      company: "",
      subject: "",
      question: "",
    });
  };

  return (
    <div
      className="col-md-7 mt-4 mt-md-0 contact-form"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <p className="contact-form-subtitle">{t("contact.subtitle1")}</p>
      <p className="contact-form-subtitle">{t("contact.subtitle2")}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">{t("contact.form.nameLabel")}</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control mb-3"
          required
          onChange={handleChange}
          value={form.name}
        />

        <label htmlFor="phone">{t("contact.form.phoneLabel")}</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.phone}
        />

        <label htmlFor="email">{t("contact.form.emailLabel")}</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control mb-3"
          required
          onChange={handleChange}
          value={form.email}
        />

        <label htmlFor="company">{t("contact.form.companyLabel")}</label>
        <input
          type="text"
          id="company"
          name="company"
          className="form-control mb-3"
          onChange={handleChange}
          value={form.company}
        />

        <label htmlFor="subject">{t("contact.form.subjectLabel")}</label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="form-control mb-3"
          required
          onChange={handleChange}
          value={form.subject}
        />

        <label htmlFor="question">{t("contact.form.questionLabel")}</label>
        <textarea
          id="question"
          name="question"
          className="form-control mb-4"
          rows={6}
          required
          onChange={handleChange}
          value={form.question}
        />

        {/* زر الإرسال من المكون العام */}
        <Button type="submit" variant="submit" dark={darkMode} fullWidth>
            {t("contact.form.submitButton")}
        </Button>

      </form>
    </div>
  );
}

export default ContactForm;
