# Contributing to SentraAI

We love your input! We want to make contributing to SentraAI as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Getting Started

1. Fork the repo and create your branch from `main`
2. Clone the forked repository to your local machine
3. Create a new branch for your feature: `git checkout -b feature/AmazingFeature`
4. Follow the coding standards outlined below

### Setting Up Development Environment

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start development servers
# Terminal 1: Start backend
cd server && npm start

# Terminal 2: Start frontend
cd client && npm run dev
```

### Code Style

- **JavaScript/React**: Follow ES6+ conventions
- **CSS**: Use BEM naming convention for class names
- **Components**: Use functional components with React Hooks
- **Comments**: Write meaningful comments for complex logic
- **Naming**: Use camelCase for variables/functions, PascalCase for components

### Commit Messages

Please follow conventional commit format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning (formatting, etc.)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Code change that improves performance
- `test:` Adding missing tests or updating existing tests
- `chore:` Changes to build process, dependencies, etc.

**Examples:**
```
feat(visitor): add visitor entry validation
fix(auth): resolve login token expiration issue
docs: update installation instructions
```

### Making Changes

1. Make your changes in your feature branch
2. Test thoroughly in your local environment
3. Ensure your code follows our style guide
4. Write or update tests as needed
5. Update documentation if you're adding/changing features

### Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable
2. Update the CHANGELOG.md with notes on your changes
3. Increase version numbers following semantic versioning
4. Ensure all tests pass before submitting
5. Create a clear and descriptive pull request title
6. Include a description of the changes and why they're needed
7. Reference any related issues (e.g., "Closes #123")

### Pull Request Template

```markdown
## Description
Brief description of what changes were made and why.

## Related Issues
Closes #(issue number)

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)

## Testing
Describe the tests you ran and how to reproduce them.

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have updated the documentation accordingly
- [ ] I have added tests to cover the changes
- [ ] All new and existing tests passed
```

### Reporting Bugs

Before submitting a bug report, please check the issue list to ensure it hasn't already been reported.

When reporting a bug, include:
- **Clear title and description**
- **Environment details** (OS, Node.js version, npm version)
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Code samples/error output** if applicable
- **Screenshots** if relevant

### Feature Requests

Feature requests are tracked as GitHub issues. When requesting a feature:

1. Use a clear and descriptive title
2. Provide a detailed description of the proposed feature
3. Explain why this feature would be useful
4. List examples of similar features in other projects if applicable
5. Include any relevant code samples

## Community

- Be respectful and constructive in all interactions
- Help maintain a welcoming environment for all contributors
- Follow our Code of Conduct (if applicable)

## Questions?

Feel free to open an issue with the label `question` if you have any questions about contributing.

---

Thank you for contributing to SentraAI! 🚀
