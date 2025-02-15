
import React from 'react';
import TopBar from './TopBar';
import MainNav from './MainNav';
import BottomNav from './BottomNav';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <TopBar />
      <MainNav />
      <BottomNav />
    </header>
  );
};

export default Header;
