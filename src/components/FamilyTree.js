import React, { useEffect, useState } from 'react';
import { fetchFamilyTree } from '../api/k9data';

function FamilyTree({ dog }) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTreeData = async () => {
      setLoading(true);
      try {
        const data = await fetchFamilyTree(dog.id);
        setTreeData(data);
      } catch (error) {
        console.error('Fehler beim Laden der Ahnentafel:', error);
      }
      setLoading(false);
    };

    loadTreeData();
  }, [dog]);

  if (loading) {
    return <p>Lade Ahnentafel...</p>;
  }

  if (!treeData) {
    return <p>Keine Daten verfügbar.</p>;
  }

  // Hier kannst du z. B. D3.js integrieren, um die Ahnentafel ansprechend zu visualisieren.
  return (
    <div>
      <pre>{JSON.stringify(treeData, null, 2)}</pre>
    </div>
  );
}

export default FamilyTree;
