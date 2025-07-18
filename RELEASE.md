# Release Process

This document describes the automated release process for CurrencyX.js v2.0.

## 🚀 Automated Release System

The package uses **release-it** with **conventional commits** for automated releases and changelog generation.

### 📋 Prerequisites

1. **NPM Token**: Set `NPM_TOKEN` in GitHub repository secrets
2. **GitHub Token**: Automatically provided by GitHub Actions
3. **Git Configuration**: Properly configured in CI/CD

### 🔄 Release Triggers

#### **1. Automatic Release (Push to main/master)**
```bash
# Any push to main/master triggers automatic patch release
git push origin main
```

#### **2. Manual Release (GitHub Actions)**
```bash
# Go to GitHub Actions → Release workflow → Run workflow
# Choose release type: patch, minor, major
```

#### **3. Local Release (Development)**
```bash
# Patch release (2.0.0 → 2.0.1)
npm run release:patch

# Minor release (2.0.0 → 2.1.0)
npm run release:minor

# Major release (2.0.0 → 3.0.0)
npm run release:major

# Pre-release versions
npm run release:beta   # 2.0.0-beta.0
npm run release:alpha  # 2.0.0-alpha.0

# Dry run (test without publishing)
npm run release:dry
```

## 📝 Conventional Commits

Use conventional commit format for automatic changelog generation:

### **Commit Types:**
```bash
feat: add new currency provider        # ✨ Features
fix: resolve conversion rate bug       # 🐛 Bug Fixes
perf: optimize provider switching      # ⚡ Performance
refactor: simplify type definitions    # ♻️ Refactoring
docs: update README examples          # 📚 Documentation
test: add provider health tests       # 🧪 Tests
build: update tsup configuration      # 🏗️ Build System
ci: improve GitHub Actions workflow   # 👷 CI/CD
chore: update dependencies            # 🔧 Maintenance
```

### **Examples:**
```bash
git commit -m "feat: add support for custom database columns"
git commit -m "fix: handle undefined exchange rates gracefully"
git commit -m "docs: add AdonisJS integration examples"
git commit -m "perf: optimize provider initialization"
```

## 🔧 Release Configuration

### **Release-it Configuration (`.release-it.json`):**
```json
{
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}",
    "push": true
  },
  "github": {
    "release": true,
    "autoGenerate": true
  },
  "npm": {
    "publish": true,
    "access": "public"
  },
  "hooks": {
    "before:init": ["npm run lint", "npm run typecheck"],
    "after:bump": ["npm run build"],
    "before:release": ["npm test"]
  }
}
```

### **GitHub Actions Workflows:**

#### **1. CI Workflow (`.github/workflows/ci.yml`):**
- Runs on every push/PR
- Tests on Node.js 18, 20, 22
- Linting, type checking, building
- Package functionality testing

#### **2. Release Workflow (`.github/workflows/release.yml`):**
- Runs on push to main/master
- Manual trigger with release type selection
- Automated testing, building, and publishing
- GitHub release creation

## 📦 Release Process Steps

### **Automated Steps:**
1. **Pre-checks**: Linting, type checking
2. **Version Bump**: Based on conventional commits
3. **Build**: Generate dist files
4. **Testing**: Run test suite
5. **Changelog**: Auto-generate from commits
6. **Git Operations**: Commit, tag, push
7. **NPM Publish**: Publish to registry
8. **GitHub Release**: Create release with notes

### **Manual Verification:**
```bash
# Check package before release
npm run build
npm run test
npm run lint
npm run typecheck

# Test package functionality
npx tsx test-fresh-package.ts

# Dry run release
npm run release:dry
```

## 🎯 Release Types

### **Patch Release (2.0.0 → 2.0.1):**
- Bug fixes
- Documentation updates
- Minor improvements
- **Trigger**: `fix:`, `docs:`, `chore:` commits

### **Minor Release (2.0.0 → 2.1.0):**
- New features
- New providers
- API enhancements
- **Trigger**: `feat:` commits

### **Major Release (2.0.0 → 3.0.0):**
- Breaking changes
- API redesign
- Architecture changes
- **Trigger**: `feat!:`, `fix!:` commits with BREAKING CHANGE

## 🔍 Monitoring Releases

### **NPM Package:**
- https://www.npmjs.com/package/@mixxtor/currencyx-js
- Check download stats and versions

### **GitHub Releases:**
- https://github.com/mixxtor/currencyx-js/releases
- View release notes and assets

### **CI/CD Status:**
- GitHub Actions tab for build status
- Release workflow logs

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. NPM Token Expired:**
```bash
# Update NPM_TOKEN in GitHub secrets
# Re-run failed workflow
```

#### **2. Build Failures:**
```bash
# Check CI logs
# Fix linting/type errors
# Re-push to trigger new release
```

#### **3. Version Conflicts:**
```bash
# Ensure package.json version is correct
# Check for existing tags
# Use --force if necessary (carefully)
```

### **Emergency Release:**
```bash
# Skip CI checks (use carefully)
npm run release -- --ci=false

# Force release specific version
npm run release -- --increment=2.1.0
```

## 📈 Release Metrics

Track these metrics for each release:
- **Build Time**: CI/CD pipeline duration
- **Test Coverage**: Ensure tests pass
- **Download Stats**: NPM package adoption
- **GitHub Stars**: Community engagement
- **Issue Resolution**: Bug fixes per release

## 🎉 Post-Release

After successful release:
1. **Verify NPM**: Check package is available
2. **Test Installation**: `npm install @mixxtor/currencyx-js`
3. **Update Documentation**: If needed
4. **Announce**: Social media, changelog
5. **Monitor**: Watch for issues or feedback

---

**Happy Releasing! 🚀**
