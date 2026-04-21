# FindSalon: Aura Velvet 🥀

FindSalon (branded as **Aura Velvet**) is a curated marketplace for premium beauty artisans and luxury salon experiences. This platform bridges the gap between high-end service providers and clients seeking tactile luxury and precision-curated aesthetics.

![Landing Page Preview](https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80)

## ✨ Core Features

- **Luxury Discovery**: A high-fidelity exploration interface for finding the most prestigious salons.
- **Smart Booking Wizard**: A seamless, multi-step reservation system for treatments and professionals.
- **Personal Workspace**: Dedicated dashboards for managing upcoming appointments, favorite artisans, and profile settings.
- **Unified Brand Navigation**: A site-wide, state-aware "Smart Navbar" that adapts to user contexts.
- **Tactile UI/UX**: Built with a "Sand & Rust" color palette, modern typography (Inter & Playfair Display), and responsive Bootstrap layouts.

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Vanilla CSS + Bootstrap 5.3
- **Icons**: React Icons (Feather Icons & Material Design)
- **State Management**: React Hooks (usePathname, useState)

### Backend
- **Framework**: Django 4.2+
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Architecture**: REST API structure for seamless frontend integration.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### 2. Installation

#### Clone the Repository
```bash
git clone https://github.com/HILTONJACKSO/FindSalon.git
cd FindSalon
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 📂 Project Structure

```text
FindSalon/
├── frontend/           # Next.js Application
│   ├── app/            # App Router & Pages
│   ├── components/     # Reusable UI Shared Components
│   └── public/         # Static assets & branding
├── backend/            # Django API Service
│   ├── core/           # Main project configuration
│   └── api/            # App-specific logic & models
└── README.md
```

## 🎨 Design Language
The "Aura Velvet" design language focuses on **Tactile Luxury**:
- **Accent Color**: `#9C4A34` (Rust)
- **Background Color**: `#FDFBF7` (Sand)
- **Typography**: `Playfair Display` for elegance, `Inter` for clarity.

---
*Created with precision for HILTONJACKSO.*
