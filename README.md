# 🚀 CAPACITY CONNECT — Enterprise Competency Management Platform

**CAPACITY CONNECT** is a centralized organizational training and competency management web application built on the **MERN stack** (MongoDB, Express.js, React with Vite, Node.js) styled with Tailwind CSS, Lucide icons, and Recharts analytics.

---

## 🌟 Core Features & Architecture

- **System Role Access Control (JWT Auth)**:
  - **Admin**: User approval dashboard, platform metrics summary cards, role breakdown pie chart, and broadcast feed publisher.
  - **Trainer**: Course creation, MCQ quiz builder with custom skill tags, student analytics charts, and assigned upskilling student roster.
  - **Trainee**: Course browsing and enrollment, interactive timed MCQ quiz runner with countdown timer, score breakdown with skill gaps, and assigned trainer cards.

- **Strategic Differentiator — Competency Mapping Engine**:
  - Automatically isolates failed question `skillTag`s upon quiz submission if score < 60%.
  - Updates Trainee's `targetSkills` array and queries MongoDB for an approved Trainer with matching `verifiedSkills`.
  - Automatically links the matching Trainer and generates the **"Recommended Trainer Assigned for Upskilling"** notification card.

---

## 🔑 Pre-Configured Demo Credentials

| Role | Email | Password | Pre-Configured Domain / Skills |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@capacity.com` | `admin123` | Platform Governance, User Approvals |
| **Trainer** | `trainer.john@capacity.com` | `trainer123` | Node.js, React, State Management, Express Routing |
| **Trainer** | `trainer.sarah@capacity.com` | `trainer123` | Cloud Computing, Docker, Kubernetes, DevOps |
| **Trainee** | `trainee.alex@capacity.com` | `trainee123` | Target Skill: Node.js |
| **Trainee** | `trainee.maria@capacity.com` | `trainee123` | General Learner Profile |
| **Trainee** | `trainee.sam@capacity.com` | `trainee123` | Pending Admin Approval (Demonstrates approval flow) |

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repository-url>
cd sih

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 2. Run the Application

```bash
# Start Backend Server (Terminal 1)
cd server
npm start
# Server listens on http://localhost:5000

# Start Frontend App (Terminal 2)
cd client
npm run dev
# App opens on http://localhost:3000
```

---

## 📁 Repository Structure

```
sih/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── seed.js
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```
