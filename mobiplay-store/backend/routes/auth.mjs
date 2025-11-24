import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";

import { requireAuth } from "../middleware/auth.mjs";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const USERS_FILE = path.join(process.cwd(), "users.json");
const AVATAR_DIR = path.join(process.cwd(), "uploads/avatars");

// إنشاء مجلد الصور تلقائيًا
if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true });

// إعداد multer لتخزين الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

// ===== قراءة المستخدمين =====
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// ===== حفظ المستخدمين =====
const saveUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error saving users:", err);
  }
};

// ===== تسجيل حساب جديد =====
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.json({ code: "wrongCredentials" });

    const users = readUsers();
    if (users.find((u) => u.email === email))
      return res.json({ code: "emailExists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      username,
      email,
      password: hashed,
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);

    return res.json({ code: "registerSuccess" });
  } catch {
    return res.json({ code: "wrongCredentials" });
  }
});

// ===== تسجيل الدخول =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find((u) => u.email === email);
    if (!user) return res.json({ code: "wrongCredentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ code: "wrongCredentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      code: "loginSuccess",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch {
    return res.json({ code: "wrongCredentials" });
  }
});

// ===== تعديل بيانات المستخدم =====
router.put(
  "/update/:id",
  requireAuth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (req.user.id.toString() !== id)
        return res.json({ code: "forbidden" });

      const { username, email, password, currentPassword, avatarDeleted } = req.body;
      const users = readUsers();
      const userIndex = users.findIndex((u) => u.id.toString() === id);
      if (userIndex === -1) return res.json({ code: "userNotFound" });

      const user = users[userIndex];

      // تحديث الاسم
      if (username) user.username = username;

      // تحديث البريد بعد التحقق من عدم التكرار
      if (email && email !== user.email) {
        if (users.find(u => u.email === email)) {
          return res.json({ code: "emailExists" });
        }
        user.email = email;
      }

      // تحديث كلمة المرور
      if (password && password.trim() !== "") {
        if (!currentPassword) return res.json({ code: "currentPasswordRequired" });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.json({ code: "wrongCurrentPassword" }); // ← الخطأ المتوقع فقط

        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
      }

      // حذف الصورة إذا طلب المستخدم
      if (avatarDeleted === "true") {
        if (user.avatar && user.avatar.startsWith("/uploads/avatars/")) {
          const oldAvatarPath = path.join(AVATAR_DIR, path.basename(user.avatar));
          if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
        }
        user.avatar = null;
      }

      // رفع صورة جديدة
      if (req.file) {
        if (user.avatar && !user.avatar.includes("placeholder")) {
          const oldAvatarPath = path.join(AVATAR_DIR, path.basename(user.avatar));
          if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
        }
        user.avatar = `/uploads/avatars/${req.file.filename}`;
      }

      users[userIndex] = user;
      saveUsers(users);

      return res.json({ code: "updateSuccess", user });
    } catch (err) {
      // فقط للأخطاء غير المتوقعة
      console.error("Unexpected error in /update:", err);
      return res.status(500).json({ code: "updateFailed" });
    }
  }
);

// ===== إعادة تعيين كلمة المرور =====
router.post("/forgot-password", (req, res) => {
  try {
    const { email } = req.body;
    const users = readUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      // إذا لم يكن هناك حساب مرتبط
      return res.json({ code: "noAccount" });
    }

    // إذا وجد الحساب، إنشاء رابط إعادة التعيين
    const token = crypto.randomBytes(20).toString("hex");
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // يمكن هنا إرسال رابط إعادة التعيين بالبريد لاحقاً
    return res.json({ code: "resetSent", resetLink });
  } catch (err) {
    console.error(err);
    return res.json({ code: "resetFailed" });
  }
});

export default router;
