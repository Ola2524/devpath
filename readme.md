# DevPath AI

> Your AI Career Copilot for Developers

An AI-powered web platform that helps software developers navigate their careers. It analyzes a developer's CV against live market data and provides skill gap analysis, matched jobs with "why you match" reasoning, and personalized career intelligence.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind |
| Backend | Express (Node.js) |
| Database | PostgreSQL + pgvector |
| Object Storage | S3 |
| AI | OpenAI / Claude |
| Auth | JWT |

---

## Project Structure

devpath-ai/
├── apps/
│   ├── web/          # Next.js frontend
│   └── backend/          # Express backend
├── packages/
│   └── shared/       # shared TypeScript types
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker (for local Postgres + S3)

### Setup

```bash
# Install dependencies
pnpm install

# Start local infra (Postgres + MinIO)
pnpm db:up

# Run frontend
pnpm dev:web

# Run backend
pnpm dev:backend