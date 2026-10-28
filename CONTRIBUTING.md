# Contributing to WebLinux

We welcome contributions from developers, Linux enthusiasts, and systems engineers worldwide!

## Development Workflow

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/your-username/weblinux.git
   cd weblinux
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Verify TypeScript & Build**:
   ```bash
   npm run lint
   npm run build
   ```

## Code Guidelines
- Use modern TypeScript with strict type definitions.
- Components are functional with React hooks.
- Use Tailwind CSS utility classes; avoid ad-hoc CSS stylesheets.
- Ensure terminal output handles raw UTF-8 streams and ANSI escape sequences.
