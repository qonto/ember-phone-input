module.exports = {
  plugins: {
    "@release-it-plugins/lerna-changelog": {
      infile: "CHANGELOG.md",
      launchEditor: true,
    },
    "@release-it-plugins/workspaces": true,
  },
  git: {
    tagName: "v${version}",
    commitMessage: "chore: release v${version}",
  },
  github: {
    release: true,
  },
  npm: false,
  hooks: {
    "after:bump": "pnpm i --frozen-lockfile=false",
  },
};
