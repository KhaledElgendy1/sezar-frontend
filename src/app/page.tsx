import Link from "next/link";
import Header from "../Components/header/Header";
import "./home.css";

export default function Home() {
  return (
    <>
      <Header />
      <div className="page-container">
        <div className="home-container">
          <img
            src="/logo.png" 
            alt="Sezar Travel Logo"
            className="logo"
          />
          <h1 className="homeHead">نظام حجز السيارات</h1>
          <p>
            مرحباً بك في نظام حجز السيارات. يمكنك إضافة طلب جديد أو استعلام عن
            الرحلات السابقة.
          </p>
          <div className="buttons-container">
            <Link href="/addBooking">
              <button className="button">إضافة طلب لعميل</button>
            </Link>
            <Link href="/searchBookings">
              <button className="button">استعلام عن الرحلات السابقة</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
