import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/" style={{ marginRight: 12 }}>Upload</Link>
        <Link to="/search">Search</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}
