# Contributing to CryptoVerseX

Thank you for your interest in contributing to CryptoVerseX! We welcome contributions from developers of all skill levels. By participating in this project, you agree to abide by our Code of Conduct and coding guidelines.

---

## 🚀 Getting Started

To get started with local development:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) (v9.x or higher)
- [MongoDB](https://www.mongodb.com/) (locally or a MongoDB Atlas cloud database instance)

### 2. Setup the Repository
Clone the repository and install dependencies for both frontend and backend:
```bash
git clone https://github.com/kananiyashvi180-svg/crypto_historical_365days_yashvi_kanani.git
cd crypto_historical_365days_yashvi_kanani
```

Install root-level, backend, and frontend packages:
```bash
# Install root workspace tooling
npm install

# Setup Backend
cd backend
npm install
cp .env.example .env

# Setup Frontend
cd ../frontend
npm install
cp .env.example .env
```

Refer to the Environment Variables section in the [README](README.md) to correctly populate the `.env` settings.

---

## 🌿 Branch Naming Rules

When creating a new branch to work on a feature, bugfix, or chore, please adhere to the following branch naming structure:

| Branch Prefix | Purpose | Example |
| --- | --- | --- |
| `feat/` | Introducing a new feature or module | `feat/watchlist-alerts` |
| `fix/` | Fixing an issue or bug | `fix/chart-rendering` |
| `docs/` | Updates or additions to documentation | `docs/contributing-guide` |
| `chore/` | Maintenance tasks, configuration changes, package updates | `chore/update-dependencies` |
| `refactor/` | Code structure improvements with no feature changes | `refactor/api-helper` |

---

## 💬 Commit Conventions

We enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification to maintain clean and searchable commit history. 

Commit messages should be structured as follows:
```text
<type>(<scope>): <short summary description>
```

### Types:
- `feat`: A new user-facing feature.
- `fix`: A bug resolution.
- `docs`: Documentation changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Changes to the build process or auxiliary tools and libraries.

### Examples:
- `feat(portfolio): implement risk calculations for assets`
- `fix(auth): clear token from store on 401 response`
- `docs(readme): add deploy walkthrough section`

---

## 🔀 Pull Request Process

1. **Create a Branch**: Create a branch from `main` using the branch naming rules.
2. **Commit Changes**: Make local commits using the commit conventions.
3. **Verify Locally**: Ensure that code compiles and has no lint issues before pushing:
   ```bash
   npm run lint
   npm run build
   ```
4. **Push & Create PR**: Push your branch to origin and open a Pull Request targeting the `main` branch.
5. **Describe Your Work**: Fill out the Pull Request template completely. Link the PR to the relevant issue (e.g., `Closes #12`).
6. **Code Review**: At least one maintainer review is required before merging. Resolve all feedback items.

---

## 🎨 Coding Standards

### Javascript
- Use clean ES6+ syntax (arrow functions, async/await, destructured objects).
- Strictly adhere to variable naming conventions:
  - camelCase for variables, functions, and files (except React components).
  - PascalCase for React component names and component filenames.
  - UPPERCASE_SNAKE_CASE for constant values.
- Keep components focused, reusable, and single-purpose.

### State Management (Redux)
- Put UI state in component-level `useState` hooks.
- Use Redux Toolkit slice reducers (`createSlice`) for global application states (e.g. `auth`, `watchlist`, `portfolio`, `coins`).

### Styling
- Use Vanilla CSS for components and layout.
- Group styles in modular stylesheets under `frontend/src/styles/` matching component scopes.
