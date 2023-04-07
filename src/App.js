import './App.css';
import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

export const fetcher = (url) => axios.get(url).then((res) => res.data);

function App() {
  const { data: items, error } = useSWR('http://localhost:3000/items', fetcher);

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {items.map(item => (
        <div key={item.item_id} className="item">
          <h2>{item.item_name}</h2>
          <img src={item.item_image_url} alt={item.item_name} />
          <p>Created at: {item.created_at}</p>
          <h3>By {item.user_name}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;
