# RULES.md

## Purpose

This document defines the mandatory development rules for all contributors (human and AI agents).

All code, commits, pull requests, branches, and architecture decisions must comply with these rules.

---

# 1. Branch Naming Convention

Every task must be developed on a separate branch.

## Format

```text
<type>/<short-description>
```

Examples:

```text
feature/user-authentication
feature/product-search
bugfix/login-error
hotfix/payment-timeout
refactor/order-service
chore/update-dependencies
docs/update-readme
```

## Forbidden

```text
abc
test
new-branch
fix
feature1
```

---

# 2. Commit Message Convention

Use Conventional Commits.

## Format

```text
<type>: <description>
```

Examples:

```text
feature: add JWT authentication
feature: implement order checkout flow

fix: resolve login redirect issue
fix: prevent duplicate order creation

refactor: extract user service
refactor: simplify validation logic

docs: update API documentation

chore: upgrade dependencies

test: add unit tests for auth service
```

## Allowed Types

```text
feature
fix
refactor
docs
test
chore
style
perf
ci
```

## Forbidden

```text
update
fix bug
new code
abc
test commit
```

---

# 3. Pull Request Rules

Every code change must be submitted through a Pull Request.

Direct push to main/master is prohibited.

PR title format:

```text
[type] Short description
```

Example:

```text
[feature] Add product filtering
[fix] Resolve login issue
```

Before merging:

- Code review required
- Build must pass
- Lint must pass
- Tests must pass

---

# 4. Component Structure

Pages must remain thin.

Do not place all UI logic inside a page file.

## Bad

```tsx
page.tsx

- 1000+ lines
- Multiple forms
- Business logic
- API calls
- Complex JSX
```

## Good

```text
page.tsx

components/
├── UserTable.tsx
├── UserForm.tsx
├── UserFilter.tsx

hooks/
├── useUsers.ts

services/
├── user.service.ts
```

Rule:

- Pages orchestrate components.
- Components render UI.
- Services call APIs.
- Hooks manage state and side effects.

---

# 5. Event Handlers

Do not write complex logic directly in JSX.

## Bad

```tsx
<button
  onClick={() => {
    validate()
    callApi()
    showToast()
  }}
>
  Save
</button>
```

## Good

```tsx
const handleSave = async () => {
  await validate()
  await saveUser()
}

;<button onClick={handleSave}>Save</button>
```

---

# 6. Business Logic Separation

Business logic must not be placed inside UI components.

## Bad

```tsx
const total = products.reduce(...);
const discount = calculateDiscount(...);
```

inside page/component.

## Good

```text
services/
utils/
domain/
```

Business logic belongs in dedicated files.

---

# 7. API Access Rules

Never call APIs directly throughout the codebase.

Use service layers.

## Good

```text
services/
├── auth.service.ts
├── product.service.ts
├── order.service.ts
```

Example:

```ts
await productService.getProducts()
```

---

# 8. Reusability First

Before creating a new component:

Check whether an existing component can be reused.

Avoid duplicate code.

If duplicate code exceeds 2 occurrences:

Refactor into:

```text
components/
hooks/
utils/
```

---

# 9. Folder Structure

Preferred structure:

```text
src/
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── stores/
├── utils/
├── types/
├── constants/
```

Feature-specific files should stay inside their feature folder.

---

# 10. TypeScript Rules

Never use:

```ts
any
```

Unless absolutely necessary.

Prefer:

```ts
interface
type
generics
```

Every API response should have explicit typing.

---

# 11. Error Handling

Never silently ignore errors.

## Bad

```ts
try {
  ...
} catch {}
```

## Good

```ts
try {
  ...
} catch (error) {
  logger.error(error);
  throw error;
}
```

---

# 12. Logging

Use centralized logging.

Avoid:

```ts
console.log()
```

in production code.

Allowed:

```ts
logger.info()
logger.warn()
logger.error()
```

---

# 13. Security Rules

Never:

- Commit secrets
- Commit API keys
- Commit access tokens
- Commit passwords

Use:

```text
.env
Secret Manager
Environment Variables
```

Sensitive information must never appear in source code.

---

# 14. Testing Rules

Critical business logic must be tested.

Required:

- Unit tests for services
- Integration tests for APIs
- E2E tests for critical user flows

---

# 15. Performance Rules

Avoid:

- Unnecessary rerenders
- Duplicate API calls
- Large components
- Unoptimized queries

Prefer:

```ts
useMemo
useCallback
React.memo
Pagination
Lazy Loading
```

when appropriate.

---

# 16. Documentation Rules

Every major feature must include:

- Purpose
- Architecture
- API usage
- Data flow

Complex logic should contain comments explaining WHY, not WHAT.

---

# 17. AI Agent Rules

When generating code, AI agents MUST:

1. Follow all rules in this document.
2. Reuse existing architecture.
3. Never introduce duplicate implementations.
4. Never generate secrets or hardcoded credentials.
5. Never bypass service layers.
6. Prefer existing components before creating new ones.
7. Keep functions small and focused.
8. Respect folder structure.
9. Generate strongly typed TypeScript.
10. Update documentation when architecture changes.

Before generating code, AI must:

- Search existing implementations.
- Reuse patterns already present in the project.
- Preserve coding conventions.

---

# 18. Code Review Checklist

Before submitting:

- Branch name follows convention.
- Commit message follows convention.
- No duplicated code.
- No hardcoded secrets.
- No unnecessary comments.
- No unused imports.
- No console.log.
- Lint passes.
- Tests pass.
- Build passes.

If any item fails, the change should not be merged.
