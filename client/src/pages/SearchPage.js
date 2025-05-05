import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import { API_BASE_URL } from '../config';

export default function SearchPage() {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setSelected(null);
      return;
    }

    const fetchData = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/api/fixtures?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      }}
    fetchData();

  }, [debouncedQuery]);

  return (
    <div style={{ margin: '2rem auto', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '4rem' }}>
      <div style={{ flex: 1}}>
        <h1>Search Fixtures</h1>
        <input
          type="text"
          placeholder="Type team name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 16 }}
        />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map(item => (
            <li
              key={item.fixture_mid}
              onClick={() => {setSelected(item)}}
              style={{
                padding: '8px 4px',
                borderBottom: '1px solid #ddd',
                cursor: 'pointer',
                backgroundColor: selected?.fixture_mid === item.fixture_mid ? '#e0f7fa': 'transparent'
              }}
            >
              {item.home_team} vs {item.away_team} — {new Date(item.fixture_datetime).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, position: 'sticky',top: '2rem'}}>
        {selected && query && (
        <div style={{
          marginTop: 24,
          padding: 16,
          border: '1px solid #ccc',
          borderRadius: 4
        }}>
          <h2>{selected.home_team} vs {selected.away_team}</h2>
          <p><strong>Competition:</strong> {selected.competition_name}</p>
          <p><strong>Season:</strong>    {selected.season}</p>
          <p><strong>Round:</strong>     {selected.fixture_round}</p>
          <p><strong>Date & Time:</strong> {new Date(selected.fixture_datetime).toLocaleString()}</p>
          <p><strong>Fixture ID:</strong> {selected.fixture_mid}</p>
        </div>
        )} 
      </div>
    </div>
  );
}
