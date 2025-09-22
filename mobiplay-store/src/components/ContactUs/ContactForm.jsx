import React, { useContext, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import Button from "../common/Button/Button";
import FormField from "../common/FormField/FormField";
import "./ContactForm.css";

function ContactForm() {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [phoneValue, setPhoneValue] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const lettersOnly = /^[A-Za-z\u0600-\u06FF\s]+$/;

  const schema = useMemo(() =>
    yup.object().shape({
      name: yup.string()
        .required(t("contact.form.nameRequired"))
        .matches(lettersOnly, t("contact.form.nameInvalid"))
        .min(3, t("contact.form.min3Chars"))
        .max(50, t("contact.form.max50Chars"))
        .test("not-empty", t("contact.form.notEmpty"), v => v?.trim().length > 0),
      phone: yup.string().required(t("contact.form.phoneRequired")),
      email: yup.string().email(t("contact.form.invalidEmail")).required(t("contact.form.emailRequired")),
      company: yup.string()
        .nullable()
        .matches(lettersOnly, t("contact.form.companyInvalid"))
        .min(3, t("contact.form.min3Chars"))
        .max(50, t("contact.form.max50Chars")),
      subject: yup.string()
        .required(t("contact.form.subjectRequired"))
        .min(3, t("contact.form.min3Chars"))
        .max(100, t("contact.form.max100Chars"))
        .test("not-empty", t("contact.form.notEmpty"), v => v?.trim().length > 0),
      question: yup.string()
        .required(t("contact.form.questionRequired"))
        .matches(lettersOnly, t("contact.form.questionInvalid"))
        .min(3, t("contact.form.min3Chars"))
        .max(500, t("contact.form.max500Chars"))
        .test("not-empty", t("contact.form.notEmpty"), v => v?.trim().length > 0),
    }), [t, i18n.language]
  );

  const { register, handleSubmit, formState: { errors, isSubmitting, touchedFields }, reset, setValue, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: { name: "", phone: "", email: "", company: "", subject: "", question: "" },
  });

  useEffect(() => { trigger(); }, [i18n.language, trigger]);

  const onSubmit = async data => {
    try {
      await new Promise(res => setTimeout(res, 1000));
      reset();
      setPhoneValue("");
      setFormMessage({ type: "success", text: t("contact.form.successMessage") });
      setSubmitAttempted(false);
    } catch {
      setFormMessage({ type: "error", text: t("contact.form.errorMessage") });
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setSubmitAttempted(true);
    const valid = await trigger();
    if (!valid) {
      setFormMessage({ type: "error", text: t("contact.form.errorMessage") });
      return;
    }
    handleSubmit(onSubmit)();
  };

  return (
    <div className={`contact-form ${theme} ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <p className="contact-form-subtitle">{t("contact.subtitle1")}</p>
      <p className="contact-form-subtitle">{t("contact.subtitle2")}</p>

      <form onSubmit={handleFormSubmit}>
        <FormField
          label={t("contact.form.nameLabel")}
          placeholder={t("contact.form.namePlaceholder")}
          name="name"
          register={register}
          error={errors.name}
          required
          isRTL={isRTL}
          touched={!!touchedFields.name || submitAttempted}
        />

        <FormField
          label={t("contact.form.phoneLabel")}
          placeholder={t("contact.form.phonePlaceholder")}
          type="phone"
          name="phone"
          value={phoneValue}
          onChange={val => {
            setPhoneValue(val);
            setValue("phone", val, { shouldValidate: true });
            trigger("phone");
          }}
          error={errors.phone}
          required
          isRTL={isRTL}
          touched={submitAttempted}
        />

        <FormField
          label={t("contact.form.emailLabel")}
          placeholder={t("contact.form.emailPlaceholder")}
          type="email"
          name="email"
          register={register}
          error={errors.email}
          required
          isRTL={isRTL}
          touched={!!touchedFields.email || submitAttempted}
        />

        <FormField
          label={t("contact.form.companyLabel")}
          placeholder={t("contact.form.companyPlaceholder")}
          name="company"
          register={register}
          error={errors.company}
          isRTL={isRTL}
          touched={!!touchedFields.company || submitAttempted}
        />

        <FormField
          label={t("contact.form.subjectLabel")}
          placeholder={t("contact.form.subjectPlaceholder")}
          name="subject"
          register={register}
          error={errors.subject}
          required
          isRTL={isRTL}
          touched={!!touchedFields.subject || submitAttempted}
        />

        <FormField
          label={t("contact.form.questionLabel")}
          placeholder={t("contact.form.questionPlaceholder")}
          name="question"
          register={register}
          error={errors.question}
          rows={6}
          required
          isRTL={isRTL}
          touched={!!touchedFields.question || submitAttempted}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("contact.form.sending") : t("contact.form.submitButton")}
        </Button>

        <div className={`form-message-below ${formMessage.type ? "fade-in" : ""}`}>
          {formMessage.type === "error" && <span className="form-error">{formMessage.text}</span>}
          {formMessage.type === "success" && <span className="form-success">{formMessage.text}</span>}
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
