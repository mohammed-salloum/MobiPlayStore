import { defineConfig } from 'vite'    // استيراد دالة لتعريف إعدادات Vite بطريقة منظمة
import react from '@vitejs/plugin-react'  // استيراد الإضافة الرسمية لدعم React (بها HMR وتحويل JSX)

export default defineConfig({
  plugins: [react()],                  // تفعيل إضافة React في إعدادات Vite
})
