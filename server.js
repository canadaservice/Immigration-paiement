import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const API_KEY = "sk_live_xxx"; // 🔥 remplace

const SERVICES = {
  biometrie: 150,
  langue: 150,
  administratif: 220,
  total: 520
};

const rates = { XOF:600, XAF:600, CDF:2500 };

const currencies = {
  BEN:"XOF", CIV:"XOF", SEN:"XOF",
  CMR:"XAF", GAB:"XAF", COG:"XAF",
  COD:"CDF"
};

app.post("/api/pay", async (req, res) => {

  const { phone, service, country } = req.body;

  const usd = SERVICES[service];
  const currency = currencies[country];
  const amount = usd * rates[currency];

  const response = await fetch("https://api.leekpay.fr/api/v1/checkout", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone,
      amount,
      currency
    })
  });

  const data = await response.json();

  res.json(data);
});

app.post("/webhook", (req, res) => {
  console.log("PAIEMENT:", req.body);
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Serveur lancé 🚀"));
