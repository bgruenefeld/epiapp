const express = require("express");
const app = express();
const cors = require("cors");
// const agent = new https.Agent({
//     rejectUnauthorized: false
//   });
//   const options: RequestInit = {
//     agent: agent as any, // 'agent' muss als 'any' gecastet werden
//   };
app.use(cors()); // Falls Frontend und Backend separat laufen
app.use(express.json()); // JSON-Daten verarbeiten

// Beispielroute für Ahnentafel-Daten
app.get("/api/ahnentafel", (req, res) => {
    res.json({ message: "Hier könnten die Ahnentafeldaten stehen!" });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
