const prisma = require("../config/prisma");

const createClient = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Le nom du client est obligatoire" });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address
      }
    });

    res.status(201).json({
      message: "Client cree avec succes",
      client
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

const getClients = async (req, res) => {
  try {
    const { search } = req.query;

    const clients = await prisma.client.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } }
            ]
          }
        : {},
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(clients);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const client = await prisma.client.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        email,
        phone,
        address
      }
    });

    res.json({
      message: "Client modifie avec succes",
      client
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({
      message: "Client supprime avec succes"
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
};
