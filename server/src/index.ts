import express, {Request, Response, NextFunction
} from "express";
import cors from "cors";
import * as https from 'https';

import dotenv from "dotenv";
import { EpiDogATService } from "./repositories/epiDogs";

interface AuthenticatedRequest extends Request {
  user?: { id: string; name?: string }; // Je nach Struktur deines Users anpassen
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const agent = new https.Agent({
  rejectUnauthorized: false
});

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req: AuthenticatedRequest, _res: Response, next) => {
  const userId = req.user ? req.user.id : "anonymous"; // Beispiel für Authentifizierung
  console.log(`User: ${userId}, IP: ${req.ip}, URL: ${req.originalUrl}`);
  next(); // WICHTIG: Damit Express mit der Verarbeitung weitermacht!
});


// Test-Route
app.get("/", (req, res) => {
  res.json({ message: "Server läuft!" });
});


app.get("/api/data", async (req, res) => {
  
  const ip = logIp(req)
  
  if (!ip.startsWith("::ffff:") && ip !== "127.0.0.1") {
    try {
      const response = await fetch(`http://ipinfo.io/${ip}/json`);
      const data = await response.json(); // JSON-Daten auslesen
      console.log("IP-Info:", data);
    } catch (error) {
      console.error("Fehler beim Abrufen von IP-Info:", error);
    }
  }  
  
  const service = new EpiDogATService()
  const dogs = service.getAllEpiDogs()
  res.json({ dogs });
});

// app.get("/api/epiprogeny/:dogName", (req, res) => {
//   //const dogName = req.params.dogName;
//   const encodedDogName = req.params.dogName;
//   const dogName = decodeURIComponent(encodedDogName);
//   const service = new EpiDogATService()
  
//   const dogs = service.getEpiProgenyByDogName(dogName);
//   res.json({ dogs });
// });

app.get("/api/at/:id/:verticalPedigree?", async (req, res) => {
  logIp(req)
  const k9DogID = req.params.id;
  console.log("req.params.verticalPedigree: ",  req.params.verticalPedigree);
  let verticalPedigree = false;
  if(req.params.verticalPedigree !== undefined && req.params.verticalPedigree === "true"){
    verticalPedigree = true
  }
 
  console.log("verticalPedigree", verticalPedigree);

  const service = new EpiDogATService();

  let response = await service.getAT(k9DogID,verticalPedigree);
  
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


function logIp(req: Request):string {
  const forwarded = req.headers["x-forwarded-for"];
  let userIp = "";

  if (typeof forwarded === "string") {
    userIp = forwarded.split(",")[0].trim(); // Erste IP extrahieren
  } else {
    userIp = req.connection.remoteAddress || "";
  }

  console.log("Nutzer-IP:", userIp);
  return userIp;
}
