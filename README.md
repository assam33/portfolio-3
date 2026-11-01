# M. Assam — Portfolio

A cinematic single-page portfolio: scroll-driven hero, toolkit, featured projects, journey timeline and contact. Plain HTML, CSS and JavaScript, so there is no build step and nothing to install.

## Files

```
index.html             page structure
assets/js/content.js   ALL your text, skills, projects, journey and links  ← edit this
assets/js/main.js      behaviour (scroll scene, animations, theme, rendering)
assets/css/style.css   styles and colours
assets/img/assam.jpg    hero photo
assets/favicon.svg     browser tab icon
```

## Editing your content

Open `assets/js/content.js` and change the values. Everything on the page is generated from it.

- **Links:** `email`, `github`, `linkedin` and `resume` are empty for now. An empty value hides its button, and filling it in makes it appear everywhere it belongs (hero icons, contact cards, “Start a conversation”, “View resume”).
- **Resume:** put your PDF in `assets/` and set `resume: "assets/resume.pdf"`.
- **Projects:** the five projects are samples, so replace them with yours. The first three are featured, the rest open under “View all projects”. Add `live` / `code` links, and optionally an `image` screenshot (16:9, e.g. `assets/img/projects/my-app.jpg`). Without an image, a preview is drawn in the project’s `accent` colour.
- **Skills:** each skill is `["Name", "Short description shown on hover"]`.
- **Journey:** one entry per chapter; the numbers are added automatically.

To change the photo, replace `assets/img/assam.jpg`. If the face isn’t framed well, adjust `object-position` in `.photo img` in `style.css` (there is a separate value for phones).

## Preview locally

Double-click `index.html`, or run `npx serve .` in this folder.

## Deploy (free)

- **Vercel:** push this folder to a GitHub repo, then on vercel.com choose *Add New → Project* and import it. No settings needed.
- **Netlify:** drag the folder onto app.netlify.com/drop.
- **GitHub Pages:** push to a repo, then *Settings → Pages → Deploy from branch (main, root)*.

After deploying, change the `og:image` tag in `index.html` to the full URL of your photo (e.g. `https://your-site.vercel.app/assets/img/asam.jpg`) so link previews on LinkedIn and WhatsApp show it.

## Credits

Fonts: Instrument Serif, Inter, JetBrains Mono (Google Fonts). Smooth scrolling: Lenis (MIT).
