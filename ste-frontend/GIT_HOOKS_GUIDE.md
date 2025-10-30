# 🐕 Git Hooks & Code Quality Guide

## Overview

Automated code quality checks on every commit and push to ensure clean, error-free code.

---

## ✅ What Runs When

### On `git commit`:

#### 1. **TypeScript Type Check**

```bash
🔍 Running TypeScript type check...
npx tsc --noEmit
```

- Checks for type errors
- Ensures type safety
- **Blocks commit** if errors found

#### 2. **ESLint + Auto-Fix (on staged files only)**

```bash
🎨 Running linters...
next lint --fix --file [staged files]
```

- Runs ESLint on staged `.ts` and `.tsx` files
- **Auto-fixes** fixable issues
- **Blocks commit** if unfixable errors

#### 3. **Prettier (on staged files only)**

```bash
prettier --write [staged files]
```

- Formats `.ts`, `.tsx`, `.json`, `.md` files
- Applies consistent code style
- **Auto-formats** and stages changes

#### 4. **Commit Success**

```bash
✅ Pre-commit checks passed!
[branch abc1234] Your commit message
```

---

### On `git push`:

#### 1. **Lint Error Check**

```bash
🔍 Checking for lint errors...
yarn show-lint-error
```

- Runs ESLint on entire codebase
- Uses `--quiet` flag (shows only errors, not warnings)
- **Blocks push** if any errors found

#### 2. **TypeScript Type Check**

```bash
📝 Running TypeScript type check...
npx tsc --noEmit
```

- Full project type check
- **Blocks push** if errors found

#### 3. **Push Success**

```bash
✅ Pre-push checks passed!
Enumerating objects...
```

---

## 🔧 Auto-Fix Features

### What Gets Fixed Automatically (on commit):

**ESLint Auto-Fixes:**

```typescript
// Missing semicolons → Added
const x = 1  →  const x = 1;

// Unused imports → Removed
import { unused } from 'lib';  →  // Removed

// Quote style → Converted to single quotes
const str = "hello"  →  const str = 'hello';

// Spacing issues → Fixed
function test(){  →  function test() {

// And many more...
```

**Prettier Auto-Formats:**

```typescript
// Long lines → Wrapped at 100 chars
const veryLongLine = something.that.is.very.long.and.exceeds.print.width;
  →
const veryLongLine =
  something.that.is.very.long.and.exceeds.print.width;

// Inconsistent indentation → Fixed
function test() {
    return {
        a: 1,
          b: 2  // Inconsistent
    }
}
  →
function test() {
  return {
    a: 1,
    b: 2  // Now consistent
  };
}
```

---

## 🎯 Workflow

### Normal Commit (With Auto-Fix):

```bash
# 1. Make changes
vim src/components/MyComponent.tsx

# 2. Stage changes
git add .

# 3. Commit
git commit -m "feat: add new component"

# Husky runs:
# ✅ TypeScript check
# ✅ ESLint --fix (auto-fixes issues)
# ✅ Prettier --write (auto-formats)
# ✅ Commit succeeds!

# 4. Push
git push

# Husky runs:
# ✅ Lint error check (entire codebase)
# ✅ TypeScript check (entire codebase)
# ✅ Push succeeds!
```

### Commit with Unfixable Errors:

```bash
git commit -m "broken code"

# Husky runs:
# ❌ TypeScript check failed!
# Error: Property 'xyz' does not exist

# Commit blocked - fix the error first
```

### Emergency Bypass (Use Sparingly):

```bash
# Skip pre-commit
git commit --no-verify -m "emergency fix"

# Skip pre-push
git push --no-verify
```

---

## 📋 Configuration Details

### `.husky/pre-commit`

```bash
# Run type check
echo "🔍 Running TypeScript type check..."
npx tsc --noEmit || exit 1

# Run lint-staged (auto-fixes)
echo "🎨 Running linters..."
npx lint-staged || exit 1

echo "✅ Pre-commit checks passed!"
```

### `.husky/pre-push`

```bash
# Run lint error check
echo "🔍 Checking for lint errors..."
yarn show-lint-error || exit 1

# Run type check
echo "📝 Running TypeScript type check..."
npx tsc --noEmit || exit 1

echo "✅ Pre-push checks passed!"
```

### `package.json` - lint-staged

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "next lint --fix --file", // Auto-fix ESLint issues
      "prettier --write" // Auto-format code
    ],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## 🎨 Scripts Reference

### Development Scripts:

```bash
# Start dev server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

### Code Quality Scripts:

```bash
# Run ESLint
yarn lint

# Run ESLint with auto-fix
yarn lint:fix

# Show lint errors only (no warnings)
yarn show-lint-error

# Run TypeScript check
yarn type-check

# Format all files
yarn format
```

---

## 🔍 Manual Checks

### Check for Lint Errors:

```bash
yarn show-lint-error
# or
npx eslint . --quiet
```

### Fix All Lint Issues:

```bash
yarn lint:fix
# or
npx next lint --fix
```

### Format All Files:

```bash
yarn format
# or
npx prettier --write "src/**/*.{ts,tsx,json,md}"
```

### Type Check:

```bash
yarn type-check
# or
npx tsc --noEmit
```

---

## 🚨 Common Issues & Solutions

### Issue: Commit Blocked by TypeScript Errors

```bash
Error: Property 'foo' does not exist on type 'Bar'
```

**Solution:**

1. Fix the TypeScript error
2. Stage the fix: `git add .`
3. Try commit again

### Issue: Commit Blocked by ESLint Errors

```bash
Error: 'variable' is assigned a value but never used
```

**Solution:**

1. Either use the variable or remove it
2. Or run `yarn lint:fix` to auto-fix
3. Stage and commit again

### Issue: Pre-Push Blocked

```bash
🔍 Checking for lint errors...
Error: ESLint found 5 errors
```

**Solution:**

1. Run `yarn show-lint-error` to see errors
2. Run `yarn lint:fix` to auto-fix
3. Fix remaining errors manually
4. Commit fixes
5. Push again

### Issue: Want to Skip Checks (Emergency)

```bash
# Skip pre-commit
git commit --no-verify -m "emergency"

# Skip pre-push
git push --no-verify
```

**⚠️ Warning:** Only use `--no-verify` in emergencies!

---

## 🎯 Benefits

### Pre-Commit (Staged Files Only):

```
✅ Fast - Only checks staged files
✅ Auto-fixes - ESLint --fix runs automatically
✅ Auto-formats - Prettier formats code
✅ Catches errors early
✅ Ensures consistency
✅ Team code quality
```

### Pre-Push (Entire Codebase):

```
✅ Final safety net
✅ Catches any errors missed
✅ Ensures push-ready code
✅ Prevents broken builds
✅ Protects main branch
```

---

## 📊 Lint-Staged vs Full Lint

### Lint-Staged (Pre-Commit):

```bash
# Only runs on staged files
git add src/components/MyComponent.tsx
git commit -m "update component"

# Husky runs:
next lint --fix --file src/components/MyComponent.tsx
prettier --write src/components/MyComponent.tsx

# Fast! Only 1 file checked
```

### Full Lint (Pre-Push):

```bash
git push

# Husky runs:
yarn show-lint-error  # Checks ALL files

# Ensures entire codebase is clean
```

---

## 🎓 Best Practices

### Commit Often:

```bash
# Good: Small, focused commits
git commit -m "feat: add buy button"
git commit -m "fix: correct price calculation"
git commit -m "style: improve responsive layout"

# Each commit is checked and auto-fixed
```

### Stage Selectively:

```bash
# Stage specific files
git add src/components/Button.tsx

# Commit (only Button.tsx is linted/formatted)
git commit -m "update button"
```

### Fix Errors Before Push:

```bash
# Before pushing, check for errors
yarn show-lint-error
yarn type-check

# Fix any issues
yarn lint:fix

# Then push
git push
```

---

## ✅ Summary

### What's Automated:

**On Every Commit:**

- ✅ TypeScript type check
- ✅ ESLint auto-fix (staged files)
- ✅ Prettier auto-format (staged files)

**On Every Push:**

- ✅ Full lint error check
- ✅ Full TypeScript check

**Result:**

- ✅ Clean commits
- ✅ Consistent code style
- ✅ No type errors
- ✅ No lint errors
- ✅ Production-ready code

---

## 🚀 Quick Reference

```bash
# Normal workflow
git add .
git commit -m "message"  # Auto-fixes & formats
git push                 # Final checks

# Manual checks
yarn lint:fix           # Fix all lint issues
yarn format             # Format all files
yarn type-check         # Check types
yarn show-lint-error    # Show only errors

# Emergency bypass
git commit --no-verify  # Skip pre-commit
git push --no-verify    # Skip pre-push
```

**Your code quality is now fully automated!** 🎉✨
