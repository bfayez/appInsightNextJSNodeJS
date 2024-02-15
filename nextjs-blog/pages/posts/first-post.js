import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FirstPost() {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            fetch('http://localhost:3000/api/tasks')
                .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
                })
                .then((data) => {
                setData(data);
                })
                .catch((error) => {
                console.error('Error fetching data:', error.message);
                });
        };
    
        fetchData();
      }, []);

  return (
    <>
      <h1>First Post</h1>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>
      <div>
        <ul>
            {data.map((item) => (
            <li key={item.id}>{item.title}</li>
            ))}
        </ul>
    </div>
    </>
  );
}