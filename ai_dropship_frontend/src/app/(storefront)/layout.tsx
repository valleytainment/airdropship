import React from 'react';
import NavigationBar from "@/components/layout/NavigationBar";
import Footer from "@/components/layout/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
