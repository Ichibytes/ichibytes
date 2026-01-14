# Testing GitHub Actions Locally with Act

We use [`act`](https://github.com/nektos/act) to test GitHub Actions workflows locally. This is a standard practice that allows you to validate CI changes before pushing to GitHub.

## Installation

### macOS

```bash
brew install act
```

### Other Platforms

Visit the [official installation guide](https://github.com/nektos/act#installation) for your platform.

## Prerequisites

- Docker must be installed and running
- For Apple Silicon (M1/M2/M3), you may need to use `--container-architecture linux/amd64`

## Usage

### List Available Workflows

```bash
act -l
```

This shows all workflows and their jobs that can be executed.

### Run All Jobs

```bash
# Simulate a push event
act push

# For Apple Silicon, use:
act push --container-architecture linux/amd64
```

### Run Specific Job

```bash
# Run only the main CI job
act -j main

# Run only the security audit job
act -j security

# With Apple Silicon
act -j main --container-architecture linux/amd64
```

### Run Specific Workflow Event

```bash
# Simulate a pull request
act pull_request

# Simulate a push to main branch
act push -e push.json
```

## Common Commands

```bash
# Dry run (see what would execute without running)
act -n

# Run with verbose output
act -v

# Run with specific event payload
act push -e .github/workflows/push.json

# Run and skip certain jobs
act push --skip-job security
```

## Limitations

- Some GitHub Actions may not work perfectly locally (e.g., artifact uploads)
- Actions that require GitHub API access may need secrets configured
- The core Nx commands (`nx affected`, `nx build`, etc.) execute correctly

## Tips

1. **Test before committing**: Always test workflow changes locally before pushing
2. **Use specific jobs**: Test individual jobs to speed up iteration
3. **Check logs**: Use `-v` flag for detailed output when debugging
4. **Apple Silicon**: Remember to use `--container-architecture linux/amd64` on M-series chips

## Example Workflow

```bash
# 1. Make changes to .github/workflows/ci.yml

# 2. Test locally
act -l                    # See what would run
act push -j main          # Test main job

# 3. If successful, commit and push
git add .github/workflows/ci.yml
git commit -m "ci: update workflow configuration"
git push
```

## Resources

- [Act GitHub Repository](https://github.com/nektos/act)
- [Act Documentation](https://github.com/nektos/act#readme)
- [Nx CI Documentation](https://nx.dev/docs/ci/intro/ci-with-nx)
