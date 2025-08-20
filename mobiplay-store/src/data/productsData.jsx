import pubgImg from '../assets/pubg_mobile.jpg';
import codMobileImg from '../assets/call_of_duty_mobile.jpg';
import freeFireImg from '../assets/free_fire.jpg';
import fortniteImg from '../assets/fortnite.jpg';
import fifaImg from '../assets/eFootball_2025.jpg';
import gtaImg from '../assets/gta_san_andreas.jpg';
import clashImg from '../assets/clash_of_clans.jpg';
import clashRoyaleImg from '../assets/clash_royale.jpg';
import jawakerImg from '../assets/jawaker.jpg';

const products = [
  { id: "pubg60uc", name: "PUBG Mobile - 60 UC", price: 2.99, game: "PUBG Mobile", img: pubgImg, descriptionKey: "productsData.pubg60uc.description", rating: 4.3, ratingCount: 120, discount: 10 },
  { id: "cod100cp", name: "Call of Duty Mobile - 100 CP", price: 5.99, game: "Call of Duty Mobile", img: codMobileImg, descriptionKey: "productsData.cod100cp.description", rating: 4.0, ratingCount: 90, discount: 15 },
  { id: "freefire100", name: "Free Fire - 100 Diamonds", price: 1.99, game: "Free Fire", img: freeFireImg, descriptionKey: "productsData.freefire100.description", rating: 3.8, ratingCount: 75, discount: 5 },
  { id: "fortnite1000", name: "Fortnite - 1000 V-Bucks", price: 9.99, game: "Fortnite", img: fortniteImg, descriptionKey: "productsData.fortnite1000.description", rating: 4.5, ratingCount: 150, discount: 20 },
  { id: "efootball1000", name: "™eFootball 2025 - 1000 Coins", price: 7.99, game: "™eFootball 2025", img: fifaImg, descriptionKey: "productsData.efootball1000.description", rating: 3.9, ratingCount: 40 },
  { id: "gtafull", name: "GTA : San Andreas - Full Game", price: 6.99, game: "GTA: San Andreas", img: gtaImg, descriptionKey: "productsData.gtafull.description", rating: 4.7, ratingCount: 230, discount: 25 },
  { id: "clash500", name: "Clash of Clans - 500 Gems", price: 4.99, game: "Clash of Clans", img: clashImg, descriptionKey: "productsData.clash500.description", rating: 4.2, ratingCount: 110, discount: 10 },
  { id: "clashroyale300", name: "Clash Royale - 300 Gems", price: 3.49, game: "Clash Royale", img: clashRoyaleImg, descriptionKey: "productsData.clashroyale300.description", rating: 3.7, ratingCount: 85 },
  { id: "jawaker500", name: "Jawaker - 500 Tokens", price: 4.99, game: "Jawaker", img: jawakerImg, descriptionKey: "productsData.jawaker500.description", rating: 4.1, ratingCount: 60 },
];
export default products;
