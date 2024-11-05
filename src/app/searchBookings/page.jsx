"use client";
import { useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { FaShare } from "react-icons/fa";
import "./SearchBookings.css";
import Header from "../../Components/header/Header";

export default function SearchBookings() {
  const [clientId, setClientId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const bookingsRef = useRef(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!clientId) {
      alert("يرجى إدخال رقم العميل");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/bookings`, {
        params: { clientId }, 
      });

      if (response.data.length === 0) {
        alert("لا توجد رحلات للعميل المحدد");
      } else {
        setBookings(response.data);
      }
    } catch (error) {
      alert("فشل في استرجاع الرحلات: " + (error.response ? error.response.data.message : error.message));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (bookingsRef.current && bookings.length > 0) {
      const canvas = await html2canvas(bookingsRef.current);
      const dataUrl = canvas.toDataURL("image/png");

      if (navigator.share) {
        try {
          await navigator.share({
            title: "الرحلات السابقة",
            text: "استعراض الرحلات السابقة لعميل",
            files: [
              new File([await (await fetch(dataUrl)).blob()], "bookings.png", {
                type: "image/png",
              }),
            ],
          });
        } catch (error) {
          alert("فشل في مشاركة الرحلات");
          console.error("Error sharing", error);
        }
      } else {
        alert("المشاركة غير مدعومة في هذا المتصفح");
      }
    } else {
      alert("لا توجد رحلات للمشاركة");
    }
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="container" style={{ textAlign: "center" }}>
          <img src="/logo.png" alt="Sezar Travel Logo" className="logo" />
          <h1>استعلام عن الرحلات السابقة لعميل</h1>
          <form onSubmit={handleSearch} style={{ width: "100%" }}>
            <input
              type="text"
              placeholder="أدخل رقم العميل"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? "جاري التحميل..." : "استعلام"}
            </button>
          </form>

          {bookings.length > 0 && (
            <div className="bookings-list" ref={bookingsRef}>
              <h2>الرحلات السابقة</h2>
              <div className="username-container">
                <h2 className="username">{bookings[0].client}</h2>
              </div>
              <div className="cards-container">
                {bookings.map((booking, index) => (
                  <div key={booking._id} className="booking-card">
                    <h3>رحلة {index + 1}</h3>
                    <div>
                      <strong>التاريخ:</strong>{" "}
                      {new Date(booking.departureDate).toLocaleString("ar-EG", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </div>
                    <div>
                      <strong>اسم العميل:</strong> {booking.client}
                    </div>
                    <div>
                      <strong>رقم العميل:</strong> {booking.clientId}
                    </div>
                    <div>
                      <strong>الكابتن:</strong> {booking.captain}
                    </div>
                    <div>
                      <strong>رقم الكابتن:</strong> {booking.captainId}
                    </div>
                    <div>
                      <strong>نوع العربية:</strong> {booking.carType}
                    </div>
                    <div>
                      <strong>موقع التحرك:</strong> {booking.pickupLocation}
                    </div>
                    <div>
                      <strong>موقع الوصول:</strong> {booking.dropoffLocation}
                    </div>
                    <div>
                      <strong>شامل الرجوع:</strong> {booking.returnIncluded ? "نعم" : "لا"}
                    </div>
                    <div>
                      <strong>التكلفة:</strong> {booking.cost} ج.م
                    </div>
                    <div>
                      <strong>ملاحظات:</strong> {booking.notes}
                    </div>
                    <div>
                      <strong>عدد الأفراد:</strong> {booking.numberOfPeople}
                    </div>
                    <div>
                      <strong>عدد الشنط:</strong> {booking.numberOfBags}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleShare} className="share-button">
                <FaShare style={{ marginRight: "5px" }} /> مشاركة
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
