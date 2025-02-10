import React, { useState } from 'react';
import DogList from './components/DogList';
import FamilyTree from './components/FamilyTree';

function App() {
  const [selectedDog, setSelectedDog] = useState(null);

  const handleDogSelect = (dog) => {
    setSelectedDog(dog);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>K9data Ahnentafel Webapp</h1>
      <DogList onDogSelect={handleDogSelect} />
      {selectedDog && (
        <div>
          <h2>Ahnentafel von {selectedDog.name}</h2>
          <FamilyTree dog={selectedDog} />
        </div>
      )}
    </div>
  );
}

export default App;
