# Workflows Engine

## 🚀 Start

**A project that run workflows on tons of hooks.**

This system allows for visual creation and management of automation nodes that connect various triggers (hooks) to execution nodes (AI, APIs, logic).

The project is split into two main parts:

- **FE (Front-End)**: A Next.js application built with React Flow, TanStack Query, and Tailwind CSS.
- **BE (Back-End)**: An Express server with Prisma ORM, Socket.io, and node-cron for scheduling.

## 📁 Project Structure

```text
.
├── BE/          # Express server & Workflow engine
└── FE/          # Next.js dashboard & Visual editor
```

## 🛠 Features

- **Visual Workflow Builder**: Interactive node-based interface using React Flow.
- **Dynamic Hooks**: Execute workflows triggered by various external hooks.
- **AI Integration**: Built-in support for OpenAI, Anthropic, and Google Gemini.
- **Real-time Monitoring**: Socket.io integration for live workflow status updates.

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (database for BE)

### Installation

1. Clone the repository
2. Install dependencies for both parts:

   ```bash
   # Front-end
   cd FE
   npm install

   # Back-end
   cd ../BE
   npm install
   ```

### Running Locally

You will need to set up `.env` files in both `BE/` and `FE/` directories before running.

**Start the Front-End:**

```bash
cd FE
npm run dev
```

**Start the Back-End:**

```bash
cd BE
npm run dev
```

## 📄 License

ISC
