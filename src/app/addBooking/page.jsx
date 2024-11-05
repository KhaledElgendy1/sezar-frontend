"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatInTimeZone } from "date-fns-tz";
import html2canvas from "html2canvas";
import { FaShare } from "react-icons/fa";
import "./add.css";
import Header from "../../Components/header/Header";

export default function AddBooking() {
  const initialState = {
    client: "",
    clientId: "",
    captain: "",
    captainId: "",
    carType: "",
    pickupLocation: "",
    dropoffLocation: "",
    returnIncluded: "no",
    cost: "",
    notes: "",
    departureDate: "",
    departureTime: "",
    numberOfPeople: "",
    numberOfBags: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const timeZone = "Africa/Cairo";
    const now = new Date();
    const formattedDate = formatInTimeZone(now, timeZone, "yyyy-MM-dd");
    const formattedTime = formatInTimeZone(now, timeZone, "HH:mm");
    setFormData((prevData) => ({
      ...prevData,
      departureDate: formattedDate,
      departureTime: formattedTime,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      phone: name === "clientId" ? value : prevData.phone,
    }));
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      client: formData.client,
      clientId: formData.clientId,
      phone: formData.clientId,
      captain: formData.captain,
      captainId: formData.captainId,
      carType: formData.carType,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      returnIncluded: formData.returnIncluded,
      cost: formData.cost,
      notes: formData.notes,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      numberOfPeople: formData.numberOfPeople,
      numberOfBags: formData.numberOfBags,
    };

    console.log("Ordered data being sent:", payload);

    try {
      const response = await axios.post(
        `https://sezar-travel-backend.vercel.app/api/bookings`,
        payload
      );
      alert("تمت إضافة الطلب بنجاح");
      setFormData({
        ...initialState,
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
      });
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(
          `Error: ${error.response.data.message || "Failed to add booking"}`
        );
      } else {
        console.error("Error adding booking:", error);
        alert("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (formRef.current) {
      const canvas = await html2canvas(formRef.current);
      const dataUrl = canvas.toDataURL("image/png");

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Booking Details",
            text: "Here is the booking detail screenshot",
            files: [
              new File([await (await fetch(dataUrl)).blob()], "booking.png", {
                type: "image/png",
              }),
            ],
          });
        } catch (error) {
          alert("فشل في مشاركة الطلب");
          console.error("Error sharing", error);
        }
      } else {
        alert("المشاركة غير مدعومة في هذا المتصفح");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="page-container" ref={formRef}>
        <div className="container">
          <img src="/logo.png" alt="Sezar Travel Logo" className="logo" />
          <h1>إضافة طلب لعميل</h1>
          <form onSubmit={handleSubmit} className="booking-form">
            <input
              type="text"
              name="client"
              placeholder="اسم العميل"
              value={formData.client}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="clientId"
              placeholder="رقم العميل"
              value={formData.clientId}
              onChange={handleChange}
            />
            <input
              type="text"
              name="captain"
              placeholder="اسم الكابتن"
              value={formData.captain}
              onChange={handleChange}
            />
            <input
              type="text"
              name="captainId"
              placeholder="رقم الكابتن"
              value={formData.captainId}
              onChange={handleChange}
            />
            <input
              type="text"
              name="carType"
              placeholder="نوع السيارة"
              value={formData.carType}
              onChange={handleChange}
            />
            <input
              type="text"
              name="pickupLocation"
              placeholder="موقع التحرك"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="dropoffLocation"
              placeholder="موقع الوصول"
              value={formData.dropoffLocation}
              onChange={handleChange}
              required
            />
            <div className="return-option-container">
              <label htmlFor="returnIncluded" className="above-label">
                شامل الرجوع
              </label>
              <select
                id="returnIncluded"
                name="returnIncluded"
                value={formData.returnIncluded}
                onChange={handleChange}
              >
                <option value="no">لا</option>
                <option value="yes">نعم</option>
              </select>
            </div>

            <input
              type="number"
              name="cost"
              placeholder="التكلفة"
              value={formData.cost}
              onChange={handleChange}
              min="0"
            />
            <textarea
              name="notes"
              placeholder="ملاحظات (اختياري)"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              style={{
                resize: "none",
                width: "100%",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
                fontSize: "1.2rem",
              }}
            />
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
            />
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
            />
            <input
              type="number"
              name="numberOfPeople"
              placeholder="عدد الأفراد"
              value={formData.numberOfPeople}
              onChange={handleChange}
              min="1"
              required
            />
            <input
              type="number"
              name="numberOfBags"
              placeholder="عدد الحقائب"
              value={formData.numberOfBags}
              onChange={handleChange}
              min="0"
            />
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "جارٍ الإضافة..." : "إضافة الطلب"}
            </button>
          </form>
          <button onClick={handleShare} className="share-button">
            <FaShare style={{ marginRight: "5px" }} /> مشاركة
          </button>
        </div>
      </div>
    </>
  );
}
