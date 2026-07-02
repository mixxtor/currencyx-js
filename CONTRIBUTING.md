# Contributing to CurrencyX

Thank you for your interest in contributing to CurrencyX! 🎉

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- TypeScript knowledge

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/mixxtor/currencyx-js.git
cd currencyx-js/packages/currencyx-js

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## 📝 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write clean, readable code
- Follow TypeScript best practices
- Add tests for new features
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run all checks
npm run lint
npm run typecheck
npm run build
npm test

# Test package functionality
npx tsx test-fresh-package.ts
```

### 4. Commit Changes

Use conventional commit format:

```bash
git commit -m "feat: add new currency provider"
git commit -m "fix: resolve rate conversion issue"
git commit -m "docs: update README examples"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

## 🎯 Contribution Types

### 🐛 Bug Fixes

- Fix existing functionality
- Add regression tests
- Update documentation if needed

### ✨ New Features

- Add new providers
- Enhance existing functionality
- Maintain backward compatibility

### 📚 Documentation

- Improve README
- Add code examples
- Update API documentation

### 🧪 Testing

- Add unit tests
- Improve test coverage
- Add integration tests

### 🔧 Maintenance

- Update dependencies
- Improve build process
- Optimize performance

## 📋 Code Standards

### TypeScript Guidelines

```typescript
// ✅ Good
interface CurrencyConfig {
  default: string
  providers: Record<string, any>
}

// ❌ Avoid
const config: any = {/* ... */}
```

### Naming Conventions

- **Classes**: PascalCase (`GoogleFinanceProvider`)
- **Functions**: camelCase (`convertCurrency`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Types**: PascalCase (`ConversionResult`)

### Error Handling

```typescript
// ✅ Good
try {
  const result = await provider.convert(amount, from, to)
  return result
} catch (error: any) {
  throw new Error(`Conversion failed: ${error.message}`)
}

// ❌ Avoid
try {
  // ...
} catch (error) {
  throw error // No context
}
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { GoogleFinanceProvider } from '../src/providers/google'

describe('GoogleFinanceProvider', () => {
  it('should convert currency correctly', async () => {
    const provider = new GoogleFinanceProvider()
    const result = await provider.convert(100, 'USD', 'EUR')

    expect(result.amount).toBe(100)
    expect(result.from).toBe('USD')
    expect(result.to).toBe('EUR')
    expect(result.result).toBeGreaterThan(0)
  })
})
```

### Test Coverage

- Aim for 80%+ test coverage
- Test happy paths and error cases
- Mock external API calls
- Test type inference

## 📚 Documentation Standards

### Code Comments

````typescript
/**
 * Convert currency amount from one currency to another
 *
 * @param amount - The amount to convert
 * @param from - Source currency code (e.g., 'USD')
 * @param to - Target currency code (e.g., 'EUR')
 * @returns Promise resolving to conversion result
 *
 * @example
 * ```typescript
 * const result = await currency.convert(100, 'USD', 'EUR')
 * console.log(result.result) // 85.23
 * ```
 */
async convert(amount: number, from: string, to: string): Promise<ConversionResult>
````

### README Updates

- Keep examples up to date
- Add new features to documentation
- Update API reference
- Include migration guides for breaking changes

## 🔄 Pull Request Process

### PR Checklist

- [ ] Code follows project standards
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] Conventional commit format used

### PR Template

```markdown
## 📝 Description

Brief description of changes

## 🎯 Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing

- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Manual testing completed

## 📚 Documentation

- [ ] README updated
- [ ] API docs updated
- [ ] Examples added/updated
```

## 🚀 Release Process

### Automated Releases

- Releases are automated via GitHub Actions
- Use conventional commits for automatic versioning
- Changelog is auto-generated

### Manual Testing Before Release

```bash
# Test package locally
npm run build
npm pack
npm install -g ./mixxtor-currencyx-js-*.tgz

# Test in separate project
mkdir test-package && cd test-package
npm init -y
npm install @mixxtor/currencyx-js
```

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow GitHub community guidelines

### Communication

- Use GitHub Issues for bug reports
- Use GitHub Discussions for questions
- Be clear and concise in communications
- Provide minimal reproducible examples

## 🎉 Recognition

Contributors will be:

- Added to package.json contributors
- Mentioned in release notes
- Listed in README contributors section
- Thanked in community channels

## 📞 Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Email**: For security issues or private matters

## 🏆 Contribution Rewards

### First-time Contributors

- Welcome package and guidance
- Mentorship for complex contributions
- Recognition in community

### Regular Contributors

- Maintainer privileges consideration
- Direct collaboration opportunities
- Speaking opportunities at events

---

**Thank you for contributing to CurrencyX! 🚀**

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in making this project better for everyone.
