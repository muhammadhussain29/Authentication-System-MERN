import React from 'react';
import bg from '/bg.jpg';

const Background = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center bg-black/80 bg-blend-overlay -z-20 absolute to-0%"
      style={{ backgroundImage: `url(${bg})` }}
    >
    </div>
  );
};

export default Background;
