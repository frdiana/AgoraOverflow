# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Routing

The application uses React Router for client-side routing. Available routes:

- `/` - Home page
- `/chat` - Chat interface
- `/agents` - Agents management
- `/settings` - Application settings

The routing is configured in `src/router/index.tsx` with a nested layout structure where the main `App` component serves as the layout wrapper for all pages.

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory to configure the API base path:

```env
VITE_API_BASE_PATH=http://localhost:3000/api
```

Available environment files:

- `.env.development` - Development environment settings
- `.env.production` - Production environment settings
- `.env.local` - Local overrides (gitignored)
- `.env.example` - Example configuration

## API Services

The application includes a service layer for API communication:

- `src/services/apiService.ts` - Base API service with common functionality
- `src/services/chatService.ts` - Chat-related API endpoints
- `src/services/index.ts` - Service exports

All API calls automatically use the `VITE_API_BASE_PATH` environment variable for the base URL.

### Chat API Endpoints

The application integrates with the following chat API endpoints:

- `GET /chat/history` - Retrieves chat conversation history
- `POST /chat/start` - Starts a new chat conversation, returns `{ chatId: string }`
- `POST /chat/{chatId}/ask` - Sends a message to a chat, expects `{ userMessage: string }`, returns `{ reply: string, fromAgent: string }`

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
