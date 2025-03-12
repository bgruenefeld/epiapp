import express, {Request, Response, NextFunction
} from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as https from 'https';

import dotenv from "dotenv";
import { EpiDogATService } from "./repositories/epiDogs";

interface AuthenticatedRequest extends Request {
  user?: { id: string; name?: string }; // Je nach Struktur deines Users anpassen
}

dotenv.config();

interface User {
  id: number;
  username: string;
  password: string;
}

const users: User[] = [
  { id: 1, username: "test", password: bcrypt.hashSync("1234", 10) },
];

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";


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
      console.log("User info:", data.city+ "/"+ data.region+"/"+data.country);
    } catch (error) {
      console.error("Fehler beim Abrufen von IP-Info:", error);
      
    }
  }  
  
  const service = new EpiDogATService()
  const dogs = service.getAllEpiDogs()
  res.json({ dogs });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/api/at/:id/:verticalPedigree?", async (req, res) => {
  logIp(req)
  const k9DogID = req.params.id;
  console.log("search for k9dataId: ",  k9DogID);
  let verticalPedigree = false;
  if(req.params.verticalPedigree !== undefined && req.params.verticalPedigree === "true"){
    verticalPedigree = true
  }
 
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

// **Middleware zur Token-Verifikation**
function verifyToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}
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
