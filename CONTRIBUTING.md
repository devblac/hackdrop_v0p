# Contributing to HackPot

First off, thank you for considering contributing to HackPot! It's people like you that make HackPot such a great platform for the community.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setting Up Your Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/hackpot-algorand-dapp.git
   cd hackpot-algorand-dapp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

### Coding Standards

- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled by Prettier
- **Component Structure**: Follow the existing component organization
- **Naming Conventions**: Use PascalCase for components, camelCase for functions and variables

### Commit Messages

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

Examples:
```
feat: add user achievement system
fix: resolve wallet connection issue on mobile
docs: update API documentation for predictions
```

### Branch Naming

- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

### Testing

- Write unit tests for new components and utilities
- Ensure all tests pass before submitting a PR
- Include integration tests for complex features
- Test on multiple browsers and devices

### Code Review Process

1. All submissions require review before merging
2. We may ask for changes to be made before a PR can be merged
3. We'll do our best to provide feedback within 48 hours
4. Once approved, a maintainer will merge your PR

## Project Structure Guidelines

### Components

- Keep components small and focused on a single responsibility
- Use TypeScript interfaces for props
- Include JSDoc comments for complex components
- Follow the existing folder structure in `src/components/`

### State Management

- Use Zustand for global state management
- Keep local state in components when appropriate
- Follow the existing store patterns

### Styling

- Use TailwindCSS for styling
- Follow the existing design system
- Ensure responsive design for all screen sizes
- Support both light and dark themes

### API Integration

- Use the existing Supabase client configuration
- Handle errors gracefully
- Implement proper loading states
- Follow the existing patterns for data fetching

## Getting Help

- Join our [Discord community](https://discord.gg/hackpot)
- Check the [documentation](docs/)
- Open an issue for questions or discussions

## Recognition

Contributors will be recognized in our README and may be eligible for special community rewards and NFTs.

Thank you for contributing to HackPot! 🎯