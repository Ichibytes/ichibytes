# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup with Nx monorepo
- Next.js web application (`apps/web`)
- NestJS API application (`apps/api`)
- React admin application (`apps/admin`)
- Shared libraries: `api-client`, `database`, `shared`, `ui`
- TypeScript configuration with path mappings
- ESLint configuration for code quality
- Prettier configuration for code formatting
- EditorConfig for consistent editor settings
- GitHub Actions CI/CD workflow
- GitHub issue and pull request templates
- Comprehensive `.gitignore` for Node.js, Nx, and framework-specific files
- Environment variable examples (`.env.example`)
- Node version management (`.nvmrc`)
- Package scripts for build, test, lint, dev, and security checks
- Pre-commit hooks with Husky and lint-staged for automatic code formatting
- Commit message validation with commitlint (Conventional Commits format)
- MIT License
- Project README with tech stack information

### Changed

- Fixed `build`, `test`, and `lint` scripts to run across all projects
- Added Nx installation configuration to `nx.json`

### Security

- Security audit scripts configured
- Environment files properly excluded from version control
- No sensitive files tracked in repository

[Unreleased]: https://github.com/Ichibytes/ichibytes/compare/v0.1.0...HEAD
