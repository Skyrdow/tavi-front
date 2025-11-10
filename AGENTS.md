# AGENT CODING GUIDELINES

## 1. Commands

| Action | Command | Notes |
| :--- | :--- | :--- |
| **Build** | `bun run build` | Compiles the Nuxt application. |
| **Format** | `bun run format` | Uses Prettier to format all files. |
| **Lint** | (Not configured) | ESLint is configured via Nuxt defaults. |
| **Test** | (Not configured) | Testing setup is currently missing. |

## 2. Code Style and Conventions

- **Language:** TypeScript and Vue 3 (Composition API).
- **Formatting:** Enforced by Prettier (`bun run format`). Do not deviate.
- **Imports:** Use absolute imports for project files (e.g., `~/components/`).
- **Naming:** Use PascalCase for components (`MyComponent.vue`), camelCase for variables/functions.
- **Types:** Use TypeScript for all new and modified code. Explicitly type function arguments and return values.
- **Vue Style:** Prefer `<script setup>` syntax. Use reactive references (`ref()`) and computed properties (`computed()`) for state management.
- **Error Handling:** Use `try...catch` blocks for asynchronous operations (API calls). Log errors clearly.
- **API Calls:** Assume API calls are asynchronous and require proper loading/error state handling in the UI.

