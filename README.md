# Frontend - Secure Content Workspace

This is the user interface for the Secure Content Workspace, built with React and Tailwind CSS.

## Tech Stack
- React 19 (Vite)
- Tailwind CSS v4
- Zustand for state management
- React Router v7 for navigation
- Axios for API communication
- React Toastify for notifications

## Project Structure
- src/components/ : Reusable UI components.
- src/pages/ : Main view containers like the Article Feed, Login, and Editor.
- src/store/ : Zustand state stores for articles and authentication.
- src/services/ : Axios instance and API abstraction layer.

## Local Setup

1. Install dependencies:
   `npm install`

2. Configuration:
   Create a `.env` file in this directory and set:
   `VITE_API_URL=http://localhost:5000/api`

3. Start the application:
   `npm run dev`

## Decisions and Trade-offs

- Minimalist Design: The "Pure White" aesthetic was chosen to maximize focus on content and typography, removing unnecessary visual noise.
- Tailwind v4: Used for its modern performance and small bundle size, allowing for high-end styling without huge CSS overhead.
- State Management: Zustand was chosen over Redux for its simplicity and lack of boilerplate, which fits the agile nature of this project.
