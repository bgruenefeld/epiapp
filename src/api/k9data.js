// Beispiel: Funktion zum Abrufen der Ahnentafel eines Hundes
export async function fetchFamilyTree(dogId) {
    // Ersetze diese URL durch die tatsächliche API-URL von K9data
    const apiUrl = `https://api.k9data.example.com/ahnentafel/${dogId}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Ahnentafel-Daten');
      }
      const data = await response.json();
  
      // Hier kannst du die Daten weiter anreichern oder verarbeiten
      return data;
    } catch (error) {
      console.error('Error fetching family tree:', error);
      return null;
    }
  }
  