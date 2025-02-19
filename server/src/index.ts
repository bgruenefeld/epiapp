import express from "express";
import cors from "cors";
import * as https from 'https';

import dotenv from "dotenv";
import { EpiDogATService } from "./repositories/epiDogs";

import * as cheerio from "cheerio";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Test-Route
app.get("/", (req, res) => {
  res.json({ message: "Server läuft!" });
});

// Beispiel-API
app.get("/api/data", (req, res) => {
  const service = new EpiDogATService()
  const dogs = service.getAllEpiDogs()
  res.json({ dogs });
});

app.get("/api/at/:id", async (req, res) => {
  const k9DogID = req.params.id;
  const service = new EpiDogATService()
  let response = await service.getAT(k9DogID,false)
  
  if (response === null || !response) {
    console.error("Fehler: API-Antwort ist leer oder ungültig");
    return res.status(500).json({ error: "Fehler beim Abrufen der Daten" });
  }
  
  const epiAt =await service.getATWithEpiScores(response)
 
  res.send(epiAt);
});
// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
