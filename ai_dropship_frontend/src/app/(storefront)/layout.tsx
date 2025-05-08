import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
