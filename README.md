# maikodoglas — command wiki

A wiki of every chat command on [twitch.tv/maikodoglas](https://www.twitch.tv/maikodoglas), in Brazilian Portuguese and English.

Built with Next.js (static export) and Tailwind CSS, hosted on GitHub Pages.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in ./out
```

## Editing commands

All commands live in [`lib/commands.ts`](lib/commands.ts). Each command has:

- `names`: the command and its aliases (never translated). The first one is the main command.
- `desc`: the description in `pt` and `en`.
- `args` (optional): parameters, using the translated labels in `argLabels`. Use `{ key: "user", optional: true }` for optional ones.
- `mod` (optional): `true` if only moderators can use it.
- `examples` (optional), `link` (optional), `group` (optional, for categories with sub-groups).

Interface text is in [`lib/i18n.ts`](lib/i18n.ts).

## Deploying

Pushing to `main` deploys through `.github/workflows/deploy.yml`.
One-time setup: in the GitHub repo go to **Settings → Pages → Build and deployment → Source** and pick **GitHub Actions**.

The site is served at `https://maikodoglas.github.io/wiki/`, with `/pt/` and `/en/` versions. The root picks a language from the visitor's browser.
