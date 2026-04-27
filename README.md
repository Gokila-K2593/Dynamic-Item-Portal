# Dynamic Item Portal (DIT Portal)

A modern, professional web application built with Next.js for managing dynamic items and generating corresponding QR codes for easy verification and viewing.

## Key Features
- **Public Scan Portal**: The home page allows users to manually search by ID or scan QR codes using their camera.
- **Admin Dashboard**: A sleek interface to manage and overview all registered items.
- **Dynamic Configuration**: Create and edit items with custom sections and fields.
- **QR Code Generation**: Automatically generates unique QR codes for every item.
- **Public View Interface**: Professional, responsive landing pages for items accessible via QR scan or ID search.
- **Secure Authentication**: Protected admin routes using JWT (JSON Web Tokens).
- **Dockerized Setup**: Fully containerized environment for consistent deployment.

## Tech Stack
- **Framework**: [Next.js 16 (App Router)]
- **Database**: [PostgreSQL]
- **ORM**: [Prisma]
- **Styling**: [Tailwind CSS 4]
- **Icons**: [Lucide React]
- **QR Scanning**: [html5-qrcode]
- **Authentication**: JWT & BcryptJS
- **Deployment**: Docker & Docker Compose

##  Search & Scan Module
The portal features a public-facing search module located at the root (`/`). It supports two modes:

### 1. Manual Search
Users can type a **Custom ID** (e.g., `ID-8829-001`) into the search field. 
- **Endpoint**: `GET /api/items/search?id={customId}`
- **Logic**: The system validates the ID against the database. If found, it redirects the user to the specific item's view page.

### 2. QR Code Scanning
A built-in scanner uses the device's camera to read QR codes instantly.
- **Intelligence**: Automatically detects if the QR contains a full URL (direct redirect) or just a Custom ID (internal routing).
- **Compatibility**: Works on both desktop webcams and mobile environment cameras.

## Installation & Local Setup

### Prerequisites
- Node.js (v20+)
- PostgreSQL (if running locally)
- Docker & Docker Compose (recommended)

### Running with Docker (Recommended)
This is the easiest way to get the project running with the database included.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Gokila-K2593/Dynamic-Item-Portal.git
    cd Dynamic-Item-Portal
    ```

2.  **Configure Environment**:
    Create a `.env` file in the root and add:
    ```env
    DATABASE_URL="postgresql://postgres:goki@db:5432/dit"
    JWT_SECRET="your_secure_secret_here"
    NEXT_PUBLIC_BASE_URL="http://localhost:3000"
    NEXT_PUBLIC_SITE_URL="https://caesuric-unomnipotent-lucian.ngrok-free.dev"
    ```

3.  **Start the containers**:
    ```bash
    docker-compose up --build -d
    ```

4.  **Access the app**:
    - **Public Scan Portal**: `http://localhost:3000/`
    - **Admin Login**: `http://localhost:3000/login`
    - **Default Credentials**: `admin@example.com` / `Admin@123` (via initial seed)

---

## 🛠️ Database Management (Prisma)
The project uses Prisma for database management. 
- **Generate Client**: `npx prisma generate`
- **Migration**: `npx prisma migrate dev`
- **Seeding**: `npx prisma db seed` (Creates the initial admin user)

---

## 🌐 Public Testing (ngrok)
Since QR codes are designed to be scanned by mobile devices, using `localhost` in the generated links will not work on external phones. Use **ngrok** to create a secure tunnel.

- **Purpose**: Allows mobile devices to scan the QR codes and see the public view pages in real-time during development.
- **Configuration**: Update `NEXT_PUBLIC_SITE_URL` in your `.env` file with your active ngrok URL.

---

## Project Architecture
```text
├── app/               # Next.js App Router (Pages & API)
│   ├── page.tsx       # Root Page: Public Search & Scan Portal
│   ├── admin/         # Private Admin Dashboard & Item Management
│   ├── api/           # Backend API Routes (Auth, Items, Search)
│   ├── login/         # Secure Login Page
│   └── view/          # Public Item View Pages ([customId])
├── components/        # Reusable UI Components (Modals, etc.)
├── lib/               # Shared logic (Prisma client, Auth utils)
├── prisma/            # Database schema and migrations
├── public/            # Static assets (Logo, Favicon)
└── Dockerfile         # Multi-stage production build config
```
