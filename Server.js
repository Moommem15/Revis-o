const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(express.static("./"));

let banco;

const categorias = [
  { id: 1, materia: "Português" },
  { id: 2, materia: "Química" },
  { id: 3, materia: "Física" }
];

const livros = [
  { id: 101, categoriaId: 1, titulo: "Moderna Gramática Portuguesa", autor: "Evanildo Bechara", anoEdicao: 2019, disponivel: true, imagem: "https://placehold.co/300x400/2563eb/ffffff?text=Moderna+Gramatica" },
  { id: 102, categoriaId: 1, titulo: "Comunicação em Prosa Moderna", autor: "Othon M. Garcia", anoEdicao: 2012, disponivel: true, imagem: "https://placehold.co/300x400/2563eb/ffffff?text=Comunicacao+Prosa" },
  { id: 103, categoriaId: 1, titulo: "Gramática Metódica da Língua Portuguesa", autor: "Napoleão Mendes de Almeida", anoEdicao: 2010, disponivel: false, imagem: "https://placehold.co/300x400/2563eb/ffffff?text=Gramatica+Metodica" },
  { id: 104, categoriaId: 2, titulo: "Química: A Ciência Central", autor: "Theodore L. Brown", anoEdicao: 2014, disponivel: true, imagem: "https://placehold.co/300x400/059669/ffffff?text=Quimica+Ciencia+Central" },
  { id: 105, categoriaId: 2, titulo: "Princípios de Química", autor: "Peter Atkins", anoEdicao: 2018, disponivel: true, imagem: "https://placehold.co/300x400/059669/ffffff?text=Principios+de+Quimica" },
  { id: 106, categoriaId: 2, titulo: "Química Orgânica - Vol. 1", autor: "Paula Yurkanis Bruice", anoEdicao: 2016, disponivel: false, imagem: "https://placehold.co/300x400/059669/ffffff?text=Quimica+Organica" },
  { id: 107, categoriaId: 3, titulo: "Fundamentos de Física: Mecânica", autor: "David Halliday e Robert Resnick", anoEdicao: 2016, disponivel: true, imagem: "https://placehold.co/300x400/dc2626/ffffff?text=Fundamentos+de+Fisica" },
  { id: 108, categoriaId: 3, titulo: "Física Conceitual", autor: "Paul G. Hewitt", anoEdicao: 2015, disponivel: true, imagem: "https://placehold.co/300x400/dc2626/ffffff?text=Fisica+Conceitual" },
  { id: 109, categoriaId: 3, titulo: "Física para Cientistas e Engenheiros", autor: "Paul A. Tipler", anoEdicao: 2009, disponivel: false, imagem: "https://placehold.co/300x400/dc2626/ffffff?text=Fisica+para+Engenheiros" }
];

async function iniciarBanco() {
  banco = await open({
    filename: "./biblioteca.db",
    driver: sqlite3.Database
  });

  await banco.exec("PRAGMA foreign_keys = ON;");

  await banco.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY,
      materia TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY,
      categoria_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      ano_edicao INTEGER NOT NULL,
      disponivel INTEGER NOT NULL CHECK (disponivel IN (0, 1)),
      imagem TEXT NOT NULL,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );
  `);

  for (const cat of categorias) {
    await banco.run(
      "INSERT OR REPLACE INTO categorias (id, materia) VALUES (?, ?)",
      [cat.id, cat.materia]
    );
  }

  for (const liv of livros) {
    await banco.run(
      `INSERT OR REPLACE INTO livros 
       (id, categoria_id, titulo, autor, ano_edicao, disponivel, imagem)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        liv.id,
        liv.categoriaId,
        liv.titulo,
        liv.autor,
        liv.anoEdicao,
        liv.disponivel ? 1 : 0,
        liv.imagem
      ]
    );
  }
}

// Rotas da API
app.get("/livros", async (req, res) => {
  try {
    const dados = await banco.all("SELECT * FROM livros");
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/categorias", async (req, res) => {
  try {
    const dados = await banco.all("SELECT * FROM categorias");
    res.json(dados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// O servidor Express só inicia após a conclusão da criação/população do banco
iniciarBanco().then(() => {
  app.listen(5501, () => {
    console.log("Servidor rodando em http://localhost:5501");
  });
}).catch((err) => {
  console.error("Erro ao iniciar o banco de dados:", err);
});