# Bills Management App

Bills Management App est une application web de gestion de facturation permettant de gérer les clients, catégories, produits, factures, paiements, statistiques et exports PDF/Excel.

## Fonctionnalités

- Authentification avec JWT
- Gestion des clients
- Gestion des catégories
- Gestion des produits
- Gestion du stock
- Création des factures
- Calcul automatique de la TVA
- Calcul de remise
- Paiements partiels et complets
- Statut automatique des factures : UNPAID, PARTIAL, PAID
- Dashboard statistiques
- Détail facture
- Export PDF
- Export Excel

## Technologies utilisées

### Frontend
- React
- TypeScript
- React Router
- Axios
- XLSX

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

### Outils
- Docker
- Git
- GitHub
- VS Code

## Installation

### 1. Cloner le projet

```bash
git clone lien-du-repository
cd bills-management-app
## Captures d’écran

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Clients

![Clients](docs/screenshots/clients.png)

### Categories

![Categories](docs/screenshots/categories.png)

### Products

![Products](docs/screenshots/products.png)

### Invoices

![Invoices](docs/screenshots/invoices.png)

### Payments

![Payments](docs/screenshots/payments.png)

### Invoice Details / PDF Export

![Invoice Details](docs/screenshots/invoice-details.png)

### Swagger API Documentation

![Swagger](docs/screenshots/swagger.png)