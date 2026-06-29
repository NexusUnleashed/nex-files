# nexFiles

The public documentation portal for the nex* package ecosystem on Achaea's
Nexus client.

## Content ownership

nexFiles owns ecosystem documentation, navigation, presentation, Compendium,
and Labs. Version 4 packages own their public documentation beside their code:

```text
nexsys4/docs/docusaurus-content
nexmap4/docs/docusaurus-content
nexgui4/docs/docusaurus-content
nexbash3/docs/docusaurus-content
```

Docusaurus mounts those directories directly. Do not copy package-owned
documentation into this repository.

## Local workspace

By default, nexFiles expects the package repositories to be siblings:

```text
workspace/
├── nex-files/
├── nexsys4/
├── nexmap4/
├── nexgui4/
└── nexbash3/
```

Set `NEX_REPOS_ROOT` when the repositories live somewhere else.

## Development

```bash
npm install
npm start
```

The development server is available at `http://localhost:3000/nex-files/`.

## Production build

```bash
npm run build
npm run serve
```

GitHub Actions reproduces the sibling checkout layout before building and
deploying to GitHub Pages.

If sibling repositories are private, configure the repository secret
`NEX_DOCS_REPO_TOKEN` with read access to those repositories so Actions can
check them out.

## Published site

https://nexusunleashed.github.io/nex-files/
