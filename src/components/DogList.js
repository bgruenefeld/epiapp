import React, { useState, useEffect } from 'react';

// Beispielhafte Hundeliste – in einer echten Anwendung über eine API laden
const dummyDogs = [
  { id: 1083868, name: 'Reggae' },
  { id: 500934, name: 'Hannah' },
];

function DogList({ onDogSelect }) {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    // Hier kannst du deine API-Logik einbauen, um die Hundeliste zu laden
    setDogs(dummyDogs);
  }, []);

  return (
    <div>
      <h2>Hundenamen</h2>
      <ul>
        {dogs.map((dog) => (
          <li
            key={dog.id}
            onClick={() => onDogSelect(dog)}
            style={{ cursor: 'pointer', margin: '0.5rem 0' }}
          >
            {dog.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DogList;
