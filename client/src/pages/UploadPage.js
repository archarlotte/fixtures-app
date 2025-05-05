import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return setMessage('Please select a CSV first.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res  = await fetch(`${API_BASE_URL}/api/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };
  
  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'text/csv') {
      setMessage('Please select a valid CSV file.');
    } else {
      setFile(selectedFile);
      setMessage('');
    }
  }

  return (
    <div>
      <h1>Upload Fixtures CSV</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        <button type="submit">
          Upload
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
