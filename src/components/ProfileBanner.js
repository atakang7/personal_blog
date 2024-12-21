// src/components/ProfileBanner.js
'use client';

export default function ProfileBanner({ user }) {
  return (
    <div className="ui container flex flex-col justify-center items-center pt-3" style={{ overflow: 'visible !important' }}>
      <div className="w-100 h-32 bg-white rounded-lg shadow-lg position-relative profile-banner-mobile" style={{ overflow: 'visible !important' }}>
        <img 
          src="/img/banner.jpeg" 
          alt="Atakan Gül's Blog Banner" 
          className="w-full h-full rounded-lg banner"
          loading="lazy"
        />
        <img 
          src="/img/avatar.webp" 
          alt="Atakan Gül's Profile Picture" 
          className="profile-img-custom"
          loading="lazy"
        />
      </div>
      
   
    </div>
  );
}