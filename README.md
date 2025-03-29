<<<<<<< HEAD
# Fintech-app
=======
# Fintech App

A comprehensive fintech application that enables users to send/receive payments via UPI, invest in SIPs & mutual funds, and participate in P2P lending.

## Features

- UPI Payment System
- SIP & Mutual Fund Investment
- P2P Lending Marketplace
- Digital Wallet
- Secure Authentication & KYC
- End-to-End Encryption

## Tech Stack

### Frontend
- React Native
- Material UI / Tailwind CSS
- Redux Toolkit
- React Navigation

### Backend
- Node.js with Express
- PostgreSQL
- Redis
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- React Native CLI
- PostgreSQL
- Redis
- Android Studio / Xcode (for mobile development)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend development server
   cd ../frontend
   npm start
   ```

## Project Structure

```
fintech-app/
├── frontend/           # React Native mobile app
├── backend/           # Node.js Express server
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## Security & Compliance

- End-to-end encryption for all transactions
- RBI/NPCI compliance for UPI transactions
- P2P lending compliance with NBFC regulations
- AI-based fraud detection system

## License

MIT License 
>>>>>>> 2712a19 (Initial commit)
