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

Docusaurus builds from committed snapshots in this repository:

```text
package-docs/nexsys4
package-docs/nexmap4
package-docs/nexgui4
package-docs/nexbash3
```

Do not edit `package-docs` by hand. Edit the owning package repository, then
refresh the snapshot with `npm run sync:package-docs`.

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

Refresh the committed documentation snapshot after package docs change:

```bash
npm run sync:package-docs
```

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

GitHub Actions builds the committed `package-docs` snapshot. It does not need
access to the private sibling package repositories.

## Published site

https://nexusunleashed.github.io/nex-files/
