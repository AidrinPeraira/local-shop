
import React from 'react';
import MainNav from './MainNav';
import BottomNav from './BottomNav';


const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <MainNav />
      <BottomNav />
    </header>
  );
};

export default Header;
