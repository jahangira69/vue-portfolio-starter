# Start here

## Open the design

Double-click Jordan-Shumate-Preview.html in Chrome, Edge, Firefox, or Safari. The supplied preview embeds Vue, styling, the font, and native artwork. No installation or internet connection is needed for the design.

## Run the Nuxt project

Install Node.js 22.12 or newer, then run these commands from the project folder:

```sh
npm ci
npm run dev
```

Open http://localhost:4173.

## Edit projects and social links

Open docs/content-editor.html. Import content/site.json and content/projects.json, make your edits, and download the updated JSON files. Replace the files in content/ and rebuild. The profile form includes GitHub, LinkedIn, X, email, and resume fields. Empty social links display a pending state.

New section content lives in content/services.json, content/technologies.json, and content/credibility.json. Services, toolkit entries, focus bars, and review examples are illustrative until approved by Jordan.

## Build

- npm run build: production Nuxt server.
- npm run generate: static export in .output/public.
- npm run offline: rebuild the single-file preview.
- npm run check: strict TypeScript check.
- npm test: contact validation and HTTP tests.

## Upload to GitHub

Upload the extracted project folder contents, including .github/, .gitignore, and package-lock.json. The included workflow can deploy the static export to GitHub Pages. Choose GitHub Actions in repository Settings → Pages. See README.md for full instructions.

## Before launch

Replace all sample projects, unconfirmed capabilities, and sample reviews with approved content. Connect Jordan’s real social profiles and email address. Direct in-site email delivery needs SMTP settings on a Nuxt server; GitHub Pages uses the email-app flow.

This project uses Nuxt 4.6.2 and Vue 3.5.44, the stable npm latest versions verified on 22 October 2026. All project text, comments, and documentation are in English.
