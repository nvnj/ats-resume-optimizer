# Contributing to ATS Resume Optimizer 🤝

Thank you for your interest in contributing to ATS Resume Optimizer! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setting Up Development Environment

1. **Fork the repository**
   - Click the "Fork" button on the GitHub repository page
   - Clone your forked repository:
     ```bash
     git clone https://github.com/yourusername/ats-resume-optimizer.git
     cd ats-resume-optimizer
     ```

2. **Set up upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/ats-resume-optimizer.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add appropriate TypeScript types
- Include meaningful comments for complex logic

### 3. Test Your Changes
```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Build the project
npm run build

# Test the build
npm run preview
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new resume template feature

- Added modern template design
- Implemented template switching
- Added template preview functionality

Closes #123"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Detailed description of what was implemented
- Screenshots/GIFs for UI changes
- Reference to related issues

## 📝 Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Avoid `any` type - use proper typing
- Use union types and generics where appropriate

### React Components
- Use functional components with hooks
- Follow the naming convention: `PascalCase` for components
- Keep components focused and single-responsibility
- Use proper prop interfaces

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use semantic color names from the design system

### File Structure
```
src/
├── components/          # React components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── constants/          # Application constants
```

## 🧪 Testing Guidelines

### Manual Testing
- Test on different screen sizes (mobile, tablet, desktop)
- Test with different browsers (Chrome, Firefox, Safari, Edge)
- Test file upload functionality with various formats
- Verify ATS scoring accuracy

### Code Quality
- Ensure all TypeScript errors are resolved
- Pass all ESLint checks
- Maintain good test coverage (when tests are added)
- Follow accessibility best practices

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details**:
   - Browser and version
   - Operating system
   - Node.js version
5. **Screenshots or videos** if applicable
6. **Console errors** or logs

## 💡 Feature Requests

For feature requests:

1. **Clear description** of the feature
2. **Use case** and benefits
3. **Mockups or wireframes** if applicable
4. **Implementation suggestions** if you have ideas

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with clear descriptions
- Update README.md for new features
- Add inline comments for complex business logic

### User Documentation
- Update user-facing documentation
- Add screenshots for new features
- Update installation and setup instructions

## 🔄 Pull Request Process

### Before Submitting
- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Responsive design is maintained

### PR Review Process
1. **Self-review** your changes
2. **Request review** from maintainers
3. **Address feedback** and make necessary changes
4. **Maintainers approve** and merge

### PR Guidelines
- Keep PRs focused and small
- Use descriptive branch names
- Include relevant issue numbers
- Add screenshots for UI changes
- Test thoroughly before submitting

## 🏷️ Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(resume): add new template selection

fix(parser): resolve PDF parsing edge case

docs(readme): update installation instructions

style(components): improve button hover states
```

## 🚨 Security

- Never commit sensitive information (API keys, passwords)
- Use environment variables for configuration
- Report security vulnerabilities privately
- Follow security best practices

## 🎯 Areas for Contribution

### High Priority
- [ ] Improve ATS scoring algorithms
- [ ] Add more resume templates
- [ ] Enhance PDF parsing accuracy
- [ ] Add unit and integration tests

### Medium Priority
- [ ] Improve accessibility features
- [ ] Add internationalization support
- [ ] Create mobile app version
- [ ] Add collaborative editing

### Low Priority
- [ ] Add dark mode theme
- [ ] Create browser extension
- [ ] Add analytics dashboard
- [ ] Integrate with job boards

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Reviews**: Learn from feedback on your PRs
- **Documentation**: Check existing docs and examples

## 🙏 Recognition

Contributors will be recognized in:
- Project README.md
- Release notes
- GitHub contributors page
- Project documentation

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to ATS Resume Optimizer! 🎉**

Your contributions help make this tool better for job seekers worldwide.
