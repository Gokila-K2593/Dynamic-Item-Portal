# Dynamic Item Portal (DIT Portal)

A modern, professional web application built with Next.js for managing dynamic items and generating corresponding QR codes for easy verification and viewing.

## Key Features
- **Admin Dashboard**: A sleek interface to manage and overview all registered items.
- **Dynamic Configuration**: Create and edit items with custom sections and fields.
- **QR Code Generation**: Automatically generates unique QR codes for every item.
- **Public View Interface**: Professional, mobile-friendly landing pages for items accessible via QR scan.
- **Secure Authentication**: Protected admin routes using JWT (JSON Web Tokens).
- **Dockerized Setup**: Fully containerized environment for consistent deployment.

## Tech Stack
- **Framework**: [Next.js 16 (App Router)]
- **Database**: [PostgreSQL]
- **ORM**: [Prisma]
- **Styling**: [Tailwind CSS 4]
- **Authentication**: JWT & BcryptJS
- **QR Engine**: qrcode.react
- **Deployment**: Docker & Docker Compose

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
    - Portal: `http://localhost:3000`
    - Login: `admin@example.com` / `Admin@123` (Initial seed user)

---

## 🛠️ Database Management (Prisma)
The project uses Prisma for database management. 
- **Generate Client**: `npx prisma generate`
- **Migration**: `npx prisma migrate dev`
- **Seeding**: `npx prisma db seed` (Creates the initial admin user)

---

## 🌐 Public Testing (ngrok)
Since QR codes are designed to be scanned by mobile devices, using `localhost` in the generated links will not work on external phones. We use **ngrok** to create a secure tunnel to our local server.

- **Purpose**: Allows mobile devices to scan the QR codes and see the public view pages in real-time during development.
- **Configuration**: Update `NEXT_PUBLIC_SITE_URL` in your `.env` file with your active ngrok URL.

---

## Packages Used
| Package | Description |
| :--- | :--- |
| `next` | React framework for server-side rendering and routing. |
| `prisma` | Database ORM for PostgreSQL. |
| `jsonwebtoken` | Token-based security for admin access. |
| `bcryptjs` | Password hashing for secure storage. |
| `qrcode.react` | High-quality QR code generation component. |
| `tailwindcss` | Utility-first CSS framework for premium UI design. |

---

## Project Architecture
```text
├── app/               # Next.js App Router (Pages & API)
│   ├── admin/         # Private Admin Dashboard & Item Management
│   ├── api/           # Backend API Routes (Auth, Items)
│   ├── login/         # Secure Login Page
│   └── view/          # Public Item View Pages ([customId])
├── components/        # Reusable UI Components (Modals, etc.)
├── lib/               # Shared logic (Prisma client, Auth utils)
├── prisma/            # Database schema and migrations
├── public/            # Static assets (Logo, Favicon)
└── Dockerfile         # Multi-stage production build config
```

---

## Tamil Explanation (தமிழ் விளக்கம்)

இந்த திட்டம் (Project) ஒரு **Dynamic Item Portal**. இதன் மூலம் நீங்கள் எந்த ஒரு பொருளுக்கும் (Item) ஒரு தனித்துவமான (Unique) QR Code-ஐ உருவாக்கலாம்.

**முக்கிய அம்சங்கள்:**
1. **Admin Dashboard**: நீங்கள் உருவாக்கிய அனைத்து பொருள்களையும் ஒரே இடத்தில் பார்க்கலாம்.
2. **QR Code**: ஒவ்வொரு பொருளுக்கும் தானாகவே QR Code உருவாகும்.
3. **Public View**: யாராவது QR Code-ஐ ஸ்கேன் செய்தால், அந்த பொருளின் விவரங்கள் ஒரு மொபைல் பேஜில் தெரியும்.

**ஏன் ngrok பயன்படுத்தப்படுகிறது?**
QR Code-ஐ உங்கள் மொபைலில் ஸ்கேன் செய்து பார்க்க வேண்டும் என்றால், அதற்கு ஒரு பொதுவான (Public) லிங்க் தேவை. உங்கள் கணினியில் உள்ள `localhost` லிங்க் மொபைலில் வேலை செய்யாது. அதற்காகவே **ngrok** பயன்படுத்தப்படுகிறது. இது உங்கள் லோக்கல் சர்வரை ஒரு பப்ளிக் லிங்க் ஆக மாற்றும்.

**எப்படி இயக்குவது (How to Run):**
Docker வைத்திருந்தால், `docker-compose up --build` என்று கொடுத்தாலே போதும், சிஸ்டம் இயங்க ஆரம்பிக்கும்.
