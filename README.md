# Lemon Classifier Project

## Project Overview
This is a React-based web application built with TypeScript and Vite, designed to classify and manage lemon-related data. The project integrates with Firebase for backend services and uses Tailwind CSS for styling.

## Technology Stack
- React
- TypeScript
- Vite
- Firebase (Authentication, Firestore)
- Tailwind CSS
- React Router
- Lucide Icons

## Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
```
project/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages
│   ├── store/           # State management
│   ├── hooks/           # Custom React hooks
│   ├── firebase.ts      # Firebase configuration
│   ├── types.ts         # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Available Scripts
- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run lint`: Run ESLint for code quality checks
- `npm run preview`: Preview the production build locally

## Environment Variables
The following environment variables are required for Firebase integration:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Deployment Information
To deploy the application:
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the contents of the `dist` folder to your hosting provider of choice.
3. For Firebase Hosting:
   ```bash
   firebase init hosting
   firebase deploy
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
