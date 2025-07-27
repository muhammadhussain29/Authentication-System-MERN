import React from 'react'

const Footer = () => {
  return (
    <footer className='absolute text-center w-full bottom-0 flex justify-end items-center md:px-20 px-4 md:py-4 py-1 inter' >
        <p className='md:text-base text-sm text-red-600'>© {new Date().getFullYear()} Mern Auth System. All rights reserved.</p>
    </footer>
  )
}

export default Footer