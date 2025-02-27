# Transparifi - for Open Startups

Transparifi is a little like LinkTree, but for displaying startup metrics. Inspired by [Open Startup List](https://openstartuplist.com/) and many of the startups listed on their website, it allows founders to easily stand up and share a page that displays their startup's metrics via widgets.

## Tech Stack

- [Next.js](https://nextjs.org/) – Framework
- [TypeScript](https://www.typescriptlang.org/) – Language
- [Tailwind](https://tailwindcss.com/) – CSS
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Prisma](https://prisma.io) - ORM [![Made with Prisma](https://made-with.prisma.io/dark.svg)](https://prisma.io)
- [Auth.js](https://authjs.dev/) – Authentication 

## Getting Started

### Prerequisites

Here's what you need to run Transparifi:

* Node.js (version >= 20.0.0)
* PostgreSQL Database

### Clone the repository

```bash
git clone https://github.com/noahmcgill/transparifi.git
```

### Install dependencies

```bash
npm install
```

### Start your database

However you choose to do so! I use the PostgreSQL desktop app when developing locally.

### Generate the Prisma client

```bash
npm run db:generate
```

### Run the dev server

```bash
npm run dev
```

## Development Roadmap

This project is currently in active development. Please check back later!

### V0
* Page Builder
* Widget Webhooks

### V1
* Widget Verification via OAuth
