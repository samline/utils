# Changesets

Every change that affects a published package needs a changeset:

```sh
bun run changeset
```

Pick the packages, the semver bump (patch, minor or major) and write a short user-facing summary. `bun run version-packages` applies pending changesets to each `package.json` and `CHANGELOG.md`. The release workflow publishes every package whose version is not on npm yet.
