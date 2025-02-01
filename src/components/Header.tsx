import React from 'react'
import { FaPython } from 'react-icons/fa'

const Header = () => {
  return (
    <header className="sticky top-0 w-full md:w-96 flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow-md z-10">
    <div className="flex items-center gap-3">
        <FaPython className="text-yellow-400 text-3xl" />
        <h1 className="text-xl font-bold">PyBuddy: Your AI Python Tutor</h1>
    </div>
    </header>
  )
}

export default Header;
