import React from "react";
import Link from "next/link";
import "./header.css";

const Header = () => {
  return (
    <div className="header">
      <Link href="/" passHref>
        <div className="header-item">الصفحة الرئيسية</div>
      </Link>
      <Link href="https://www.facebook.com/abooday.travel?mibextid=ZbWKwL" passHref>
        <div className="header-item">تواصل معنا</div>
      </Link>
    </div>
  );
};

export default Header;
