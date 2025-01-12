// src/components/ProfileBanner.js
'use client';
import Image from "next/image";

export default function ProfileBanner() {
  return (
    <div className="ui container flex flex-col justify-center items-center pt-3 mb-20" style={{ overflow: 'visible !important' }}>
      <div className="w-100 h-32 bg-white rounded-lg shadow-lg position-relative profile-banner-mobile" style={{ overflow: 'visible !important' }}>
        <Image 
          src="/img/banner.jpeg"
          width={1384}
          height={248}
          alt="Atakan Gül's Blog Banner" 
          className="w-full h-full rounded-lg banner"
          loading="lazy"
        />
        <Image 
          src="/img/avatar.webp" 
          width={150}
          height={150}
          alt="Atakan Gül's Profile Picture" 
          className="profile-img-custom"
          loading="lazy"
        />
      </div>
    </div>
  );
}
