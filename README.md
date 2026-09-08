# MMF Portal

A Next.js application for the MMF portal interface.

## Prerequisites

Before you begin, make sure you have:

- Node.js 20 or newer
- npm 10 or newer
- A terminal or command prompt

## Installation

1. Open a terminal in the project folder.
2. Install the project dependencies:

```bash
npm install
```

If this is your first time setting up the project, this will install all packages required by the app.

## Running the app locally

### Development mode

Start the local development server:

```bash
npm run dev
```

Then open the app in your browser:

- http://localhost:3000

The app will hot-reload while you edit files.

### Production build

To create a production build:

```bash
npm run build
```

Then run the production server:

```bash
npm run start
```

Open the same URL in your browser:

- http://localhost:3000

## Useful commands

```bash
npm run lint
```

This checks the codebase for linting issues.

## Stopping the app

In the terminal where the app is running, press:

```bash
Ctrl + C
```

## Troubleshooting

- If you see a missing dependency error, run `npm install` again.
- If the app does not start, confirm that Node.js is installed and compatible with the project version.
- If port 3000 is already in use, Next.js will usually tell you which port it started on instead.
