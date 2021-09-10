# RELEASE

In order to be able to release, you will need to be added to the npm package.
Type `npm owner ls` to see if your authorized or not.

1. Run these commands
```bash
- yarn lerna-changelog --from=previous-tag >> CHANGELOG.md (manual cleanup)
- git commit -m "Update CHANGELOG for the release"
- yarn version
- git push origin master the-new-tag
- npm publish
```

2. Draft a release: https://github.com/qonto/ember-phone-input/releases/new
