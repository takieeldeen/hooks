# Hooks SASS

## What is hooks?

**Hooks is a SASS that enable you to run drag and drop defined workflows on the trigger of different kinds of hooks (Manual Triggers, Google forms, Slack,...)**

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
  <img width="2559" height="1219" alt="image" src="https://github.com/user-attachments/assets/5ec9d61b-89a3-497f-8cf1-3980b53650db" />

- **Dynamic Hooks**: Execute workflows triggered by various external hooks.
  <img width="2559" height="1268" alt="image" src="https://github.com/user-attachments/assets/e7f938e4-0947-40fc-86fa-643ecb47bf5b" />

- **AI Integration**: Built-in support for OpenAI, Anthropic, and Google Gemini.
  <img width="2559" height="1271" alt="image" src="https://github.com/user-attachments/assets/327c0e8e-4c62-417a-a6d3-6a39a38241fa" />

- **Real-time Monitoring**: Socket.io integration for live workflow status updates.
  <img width="2559" height="1269" alt="image" src="https://github.com/user-attachments/assets/0474b012-a77b-438c-99ea-f98f64814d5b" />


## How to start this project

### Prerequisites

- Node.js (v18+)
- PostgreSQL (I used neon and prisma(as an ORM)) (database for BE)

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

You will need to set up `.env` files in both `BE/` and `FE/` directories before running here is how your backend .env file should look like.
```text
PORT=8080

DATABASE_URL="postgresql://neondb_owner....."
BETTER_AUTH_SECRET="......"
BETTER_AUTH_URL= "http://localhost:3000" # Your Localhost

# Payments
PAYMOB_PUBLIC_KEY="egy_pk_test_......"
PAYMOB_SECRET_KEY="egy_sk_test_......"
PAYMOB_INTEGRATION_ID="....."
PAYMOB_API_KEY="......."
PAYMOB_REDIRECT_URL="http://localhost:3000" # Your Localhost

# PAYMOB_NOTIFICATION_URL="http://localhost:8080" # Your API Localhost
PAYMOB_NOTIFICATION_URL="https://XXXXX.ngrok-free.dev" # Published URL You can run npm run ngrok and get the url from it

# Environments
NODE_ENV="development"
DEBUG_MODE="true" 

# Webhooks
GOOGLE_FORM_WEBHOOK_SECRET="XXXXXXXXXXXXXXXXXXXXXXXX" #Secret used in verifying the webhook request
STRIPE_WEBHOOK_SECRET="QOngSm84_MHuP02_65_PSBNYu" #Secret used in verifying the webhook request

# Ai SDK
AI_GATEWAY_API_KEY="XXXXXXXXXXXXXXXXXXXXX" #GEMINI_API_KEY
OPENAI_API_KEY="XXXXXXXXXXXXXXXXXXXXXX" #OPENAI_API_KEY
```
- First : Backend
  you will need to signup for a new account in
   - Neon (For creating your database)
   
   - Paymob (For payment implementation)
  

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
