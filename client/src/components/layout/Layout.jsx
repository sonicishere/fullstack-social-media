import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="container-fluid" style={{ flexGrow: 1, padding: 0 }}>
        <div className="d-flex w-100 justify-content-center" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Sidebar />
          <main style={{ flexGrow: 1, maxWidth: '800px', padding: '20px', minHeight: 'calc(100vh - 70px)' }}>
            <Outlet />
          </main>
          <RightPanel />
        </div>
      </div>
    </div>
  );
};

export default Layout;
