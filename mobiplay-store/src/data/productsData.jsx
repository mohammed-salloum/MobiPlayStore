// استيراد صور المنتجات من مجلد الأصول
import pubgImg from '../assets/pubg_mobile.jpg';
import codMobileImg from '../assets/call_of_duty_mobile.jpg';
import freeFireImg from '../assets/free_fire.jpg';
import fortniteImg from '../assets/fortnite.jpg';
import fifaImg from '../assets/eFootball_2025.jpg';
import gtaImg from '../assets/gta_san_andreas.jpg';
import clashImg from '../assets/clash_of_clans.jpg';
import clashRoyaleImg from '../assets/clash_royale.jpg';
import jawakerImg from '../assets/jawaker.jpg';

// مصفوفة بيانات المنتجات المتاحة في المتجر
const products = [
  {
    id: 1,  // معرف فريد لكل منتج
    name: "PUBG Mobile - 60 UC",
    price: 2.99, // السعر قبل الخصم بالدولار
    discount: 15,  // نسبة الخصم المئوية
    game: "PUBG Mobile",
    img: pubgImg, // مسار صورة المنتج
    description: "Get 60 UC in PUBG Mobile and start your journey with exclusive weapons and skins.",
    rating: 4.3,  // متوسط التقييم الأولي
    ratingCount: 120, // عدد التقييمات
  },
  {
    id: 2,
    name: "Call of Duty Mobile - 100 CP",
    price: 5.99,
    discount: 10,
    game: "Call of Duty Mobile",
    img: codMobileImg,
    description: "Get 100 CP in Call of Duty Mobile to upgrade your weapons and unlock characters.",
    rating: 4.0,
    ratingCount: 90,
  },
  {
    id: 3,
    name: "Free Fire - 100 Diamonds",
    price: 1.99,
    discount: 0, // بدون خصم
    game: "Free Fire",
    img: freeFireImg,
    description: "Get 100 Diamonds in Free Fire to purchase exclusive outfits and weapons.",
    rating: 3.8,
    ratingCount: 75,
  },
  {
    id: 4,
    name: "Fortnite - 1000 V-Bucks",
    price: 9.99,
    discount: 20,
    game: "Fortnite",
    img: fortniteImg,
    description: "Buy 1000 V-Bucks in Fortnite to unlock new skins and in-game items.",
    rating: 4.5,
    ratingCount: 150,
  },
    {
    id: 5,
    name: "™eFootball 2025 - 1000 Coins",
    price: 7.99,
    discount: 0,
    game: "™eFootball 2025",
    img: fifaImg,
    description: "Get 1000 Coins in ™eFootball 2025 to strengthen your team and improve player performance.",
    rating: 3.9,
    ratingCount: 40,
  },
    {
    id: 6,
    name: "GTA : San Andreas - Full Game",
    price: 6.99,
    discount: 5,
    game: "GTA: San Andreas",
    img: gtaImg,
    description: "Get the full version of GTA: San Andreas and enjoy an open world full of adventures.",
    rating: 4.7,
    ratingCount: 230,
  },
  {
    id: 7,
    name: "Clash of Clans - 500 Gems",
    price: 4.99,
    discount: 10,
    game: "Clash of Clans",
    img: clashImg,
    description: "Top up 500 Gems in Clash of Clans to speed up building and buy boosts.",
    rating: 4.2,
    ratingCount: 110,
  },
  {
    id: 8,
    name: "Clash Royale - 300 Gems",
    price: 3.49,
    discount: 0,
    game: "Clash Royale",
    img: clashRoyaleImg,
    description: "Get 300 Gems in Clash Royale to upgrade cards and unlock treasure chests.",
    rating: 3.7,
    ratingCount: 85,
  },
  {
    id: 9,
    name: "Jawaker - 500 Tokens",
    price: 4.99,
    discount: 12,
    game: "Jawaker",
    img: jawakerImg,
    description: "Top up 500 Gems in Jawaker to enhance your gameplay experience and unlock exclusive features.",
    rating: 4.1,
    ratingCount: 60,
  },
];

// تصدير بيانات المنتجات لاستخدامها في باقي أجزاء التطبيق
export default products;
