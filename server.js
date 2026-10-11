const http = require("http");
const fs = require("fs");

const FILE = "pesanan.json";

const menu = [
  { id: 1, nama: "Nasi Goreng", harga: 15000 },
  { id: 2, nama: "Mie Goreng", harga: 13000 },
  { id: 3, nama: "Es Teh", harga: 5000 },
];

// baca buku catatan kalau sudah ada, kalau belum mulai kosong
const pesanan = fs.existsSync(FILE)
  ? JSON.parse(fs.readFileSync(FILE, "utf8"))
  : [];

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.end();
    return;
  }

  if (req.url === "/menu" && req.method === "GET") {
    res.end(JSON.stringify(menu));
  } else if (req.url === "/pesan" && req.method === "POST") {
    let isi = "";
    req.on("data", (potongan) => {
      isi += potongan;
    });
    req.on("end", () => {
      const nota = JSON.parse(isi);
      nota.id = pesanan.length + 1;
      pesanan.push(nota);
      fs.writeFileSync(FILE, JSON.stringify(pesanan, null, 2)); // catat ke buku
      res.end(JSON.stringify({ pesan: "Pesanan diterima", nota }));
    });
  } else if (req.url === "/pesanan" && req.method === "GET") {
    res.end(JSON.stringify(pesanan));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ pesan: "Tidak ditemukan" }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Dapur buka di port " + PORT);
});