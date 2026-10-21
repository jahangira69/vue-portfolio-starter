# Jordan Shumate — Portfolio · Version 2

A custom portfolio built with **Nuxt 4, Vue 3, and TypeScript**. The design uses warm ivory, coral accents, editorial typography, custom product-interface artwork, and considered motion.

The project includes the source code, an offline preview builder, a local content editor, an optional SMTP contact endpoint, and a GitHub Pages workflow. It does not require a paid CMS.

## Version 2 additions

The expanded design adapts the supplied section references to an individual portfolio and keeps the existing ivory/coral visual system:

- Three service tabs — Frontend, Backend, and Server & DevOps — with 18 service cards.
- An engineering approach section with a qualitative focus profile and a personal working checklist.
- An 18-item technology grid with hover treatments.
- Four collaboration-principle cards and ten explicitly marked sample review layouts.
- Footer icons for GitHub, LinkedIn, X, and email. Blank destinations stay visibly pending; add only Jordan’s confirmed profiles.
- A pointer halo, hero parallax, and card spotlights on suitable pointer devices. Reduced-motion preferences are respected, and touch devices keep normal controls.

All unverified capabilities remain illustrative. Sample review text is layout content, not evidence of real clients, ratings, or outcomes. This documentation does not claim new browser or build checks; see the handoff QA report for the checks actually completed.

## Start locally

Install **Node.js 22.12 or newer** and npm. From this folder:

```sh
npm ci
npm run dev
```

Open **http://localhost:4173**. Stop the server with `Ctrl+C`.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the exact dependencies recorded in `package-lock.json`. |
| `npm run dev` | Start the Nuxt development server on port 4173. |
| `npm run check` | Run TypeScript checks. |
| `npm test` | Run the included automated tests. |
| `npm run build` | Build the Nuxt application and server. |
| `npm start` | Start a completed server build; hosting environment variables must already be configured. |
| `npm run generate` | Generate a static website in `.output/public/`. |
| `npm run preview` | Preview the generated/built application locally. |
| `npm run offline` | Create the self-contained `Jordan-Shumate-Preview.html` file. |

## Open the design without installing anything

Double-click the supplied **Jordan-Shumate-Preview.html** in a modern browser. Vue, CSS, fonts, and artwork are embedded; the design does not need a web server or a CDN. Project filters, case-study dialogs, navigation, theme selection, and animations work in this preview.

The offline file uses the email-app contact flow. It cannot run a server-side SMTP endpoint. An external destination such as a configured GitHub link or email app naturally requires the relevant app or network connection.

To rebuild this file after changing content, install dependencies and run `npm run offline` again.

## Edit content without writing code

1. Open **docs/content-editor.html** in your browser.
2. Import the current **content/site.json** and **content/projects.json**.
3. Edit the profile or add/edit a project. Choose **Save project** for project changes.
4. Download **site.json** and **projects.json**.
5. Replace the matching files in **content/**. Keep those exact filenames.
6. Rebuild with `npm run generate`, `npm run build`, or `npm run offline`, depending on the output you need.

The profile editor includes optional `githubUrl`, `linkedinUrl`, and `xUrl` fields plus the contact email. It keeps imported fields and unknown profile properties intact.

The editor manages profile/project files; edit the three new section JSON files directly in the source folder, then rebuild.

The editor works locally and does not publish changes. Your in-tab edits are not a permanent save until you download the JSON files. It preserves imported skills, experience, and principles. Those arrays can be changed directly in `content/site.json`.

### Content files

- `content/site.json`: identity, introductory copy, profile links, contact settings, skills, experience, and principles.
- `content/services.json`: the three service categories and their individual cards; confirm the offered services before publishing.
- `content/technologies.json`: the technology tile list; match it to Jordan’s confirmed toolset.
- `content/credibility.json`: engineering focus, collaboration principles, and testimonial layouts. Replace sample reviews only with approved real feedback.
- `content/projects.json`: project cards and detailed case studies. Each project has a unique lowercase `id`, a `category`, a `kind` for artwork, tags, and the challenge/approach/outcome text.
- `components/ProjectArtwork.vue`: the four reusable visual styles: `atlas`, `forma`, `pulse`, and `relay`.
- `assets/css/main.css`: the visual system, responsive layouts, and animations.
- `components/Portfolio.vue`: the portfolio interface and client interactions.
- `server/api/contact.post.ts`: optional in-site contact delivery.

A new JSON project entry automatically appears in the portfolio and its category filter. The editor supports all project fields, so you can expand the portfolio without modifying Vue templates. To use a real project screenshot, copy it into `public/projects/`, set the project’s optional `image` to `"./projects/my-project.webp"`, and add descriptive `imageAlt` text. The content editor includes both fields. An `https://` image URL or root-relative asset path is also supported. Leave `image` empty to keep the selected Atlas/Forma/Pulse/Relay artwork. Existing project JSON without these optional fields remains compatible. For a fully offline preview, use local images; externally hosted images still require a network connection.

## Connect the contact form

The supplied client brief does not contain Jordan’s contact email, social links, SMTP credentials, or resume. These are intentionally blank. The form does **not** claim a message was sent when it was not.

### Option A — email app, including static hosting

In `content/site.json` set:

```json
{
  "email": "your-real-email@example.com",
  "contactMode": "email"
}
```

Keep the other profile properties. Rebuild the website. A valid submission opens the visitor’s email app with the message prepared. The visitor must send it there. This mode works with GitHub Pages and the offline preview.

### Option B — send inside the website through SMTP

Use a host that runs the Nuxt server, rather than a static-only host.

1. Set `contactMode` to `"smtp"` in `content/site.json`.
2. Keep `contactEndpoint` as `"/api/contact"` for the included endpoint.
3. Copy `.env.example` to `.env` for local development, and fill in:
   - `SMTP_HOST`
   - `SMTP_PORT` — normally `587` for STARTTLS or `465` for TLS, as required by your provider.
   - `SMTP_USER`
   - `SMTP_PASS`
   - `CONTACT_FROM` — a sender accepted by the SMTP account/provider.
   - `CONTACT_TO` — Jordan’s receiving address.
4. For deployed hosting, set those values in the host’s private environment settings.
5. Run `npm run build`, then `npm start` with the environment configured.

For a local production build using the `.env` file explicitly:

```sh
npm run build
node --env-file=.env .output/server/index.mjs
```

The production server does not automatically load a local `.env` file through `npm start`. Never upload real credentials to GitHub. The `.gitignore` excludes `.env` files and retains `.env.example`.

The endpoint validates form input, rejects malformed requests, checks request origin, includes a honeypot, and uses a best-effort in-memory rate limit. If you deploy multiple server instances, use a shared rate limiter at the hosting/application layer as needed. The endpoint reports a normal successful delivery only after SMTP accepts the message.

**Email delivery still requires configuration and an end-to-end test with Jordan’s real receiving account. No real inbox or SMTP account was supplied for this handoff.** SMTP acceptance is not a guarantee of inbox placement.

## Upload to GitHub

Create an empty repository, then upload this folder’s **contents**, including `package-lock.json`, `.gitignore`, and `.github/`. Do not upload `node_modules`, `.nuxt`, `.output`, or a real `.env` file.

You can use GitHub’s browser upload, GitHub Desktop, or Git:

```sh
git init
git add .
git commit -m "Add Jordan portfolio"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_REPOSITORY_URL` with the repository you created.

### Publish with GitHub Pages

The supplied `.github/workflows/deploy-pages.yml` runs on pushes to **main** and can also be started manually.

1. Upload the source to the repository’s `main` branch.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Open the **Actions** tab and let the portfolio workflow complete.
4. Use the Pages URL shown by the deployment.

The workflow installs dependencies, runs tests, generates the static site, and uploads `.output/public/`. It sets the base path and canonical origin for repository Pages deployments.

**GitHub Pages cannot run the included SMTP API.** Use `contactMode: "email"` there, or deploy the Nuxt server on suitable server hosting for in-site delivery. Do not place SMTP secrets into frontend JSON.

### Other hosting

- **Static host:** run `npm run generate` and publish `.output/public/`. Use the email-app contact flow.
- **Node.js server:** run `npm run build` and start `.output/server/index.mjs`. Configure SMTP privately for the direct contact form.
- Set **NUXT_PUBLIC_SITE_URL** to the final public website URL when building/deploying, for example `https://your-domain.com/`, so the site can emit its canonical URL. Do not use an invented live domain.

## Brief coverage

| Client requirement | Included implementation |
| --- | --- |
| Modern, clean, custom Vue portfolio | Nuxt/Vue source, editorial design, custom interface artwork. |
| Projects and case studies | Filterable project grid and detailed accessible dialogs. |
| Technical skills | Dedicated grouped skills section. |
| Professional experience | Dedicated experience timeline. |
| Responsive and fast | Responsive layouts, local assets, lightweight CSS-led motion, static-generation option. |
| SEO-friendly | Server-rendered/generated content, title and description, social metadata, profile structured data, optional canonical URL. |
| Smooth animations and strong UX | Scroll reveals, artwork motion, pointer halo/parallax/spotlights on supported devices, hover treatments, project transitions, and reduced-motion support. |
| Additional section references | Three service tabs, engineering approach, technology grid, and clearly labeled review layouts. |
| Social icons | GitHub, LinkedIn, X, and email with configurable actual destinations. |
| Contact form | Validated email-app flow plus optional SMTP server delivery. |
| Add projects later | Local content editor and centralized JSON data. |
| Room to expand | Component-based source and a case-study data model. |

## Before client launch

- Replace the four concept case studies with Jordan’s real projects and approved artwork/screenshots.
- Confirm the actual technical skills, career history, dates, and about copy.
- Add Jordan’s real email, GitHub, LinkedIn, optional X profile, and optional resume. The social icons remain pending until their destinations are supplied.
- Verify the services and technology list against Jordan’s real capabilities.
- Replace or remove every sample testimonial; preserve sample labels until approved feedback and attribution are supplied. Do not copy agency ratings or client counts into this personal portfolio.
- Keep `demoContent: true` until the sample skills, experience, and project content have been replaced; then set it to `false`.
- Choose the contact mode, configure it, and test a complete inquiry.
- Set the final site URL and confirm the production links, mobile layouts, keyboard navigation, and email delivery.
- Keep the local content editor in your source handoff; there is no need to publish it publicly.

The profile name, independent role, and United States location come from the supplied brief. Project names, project mockups, case-study text, skill and service lists, technology tiles, sample reviews, and unconfirmed career placeholders are clearly illustrative. They are not claims of Jordan’s shipped work, employers, clients, or measured outcomes.
# vue-portfolio-starter
