/* ════════════════════════════════════════════════════════════
   EDIT YOUR CONTENT HERE — everything on the page comes from this object.
   ════════════════════════════════════════════════════════════ */
const SITE = {
  name: "M. Assam",
  role: "Full-Stack Web Developer",
  roleShort: "Developer",
  degree: "BS Computer Science, University of Gujrat",
  certificate: "Meta Full Stack Developer",
  experience: "6 months",
  status: "Available for opportunities",
  heroEyebrow: "Full-stack web developer · Gujranwala, Pakistan",
  heroLine1: "Ideas into", heroLine2: "impact.",
  heroLede: "I build modern web applications end to end, from the database to the last pixel of the interface.",
  aboutEyebrow: "A little about me",
  aboutLine1: "Building with", aboutLine2: "curiosity.",
  aboutLede: "BS Computer Science at the University of Gujrat. Meta Full Stack Developer certificate, and six months of hands-on experience shipping web apps.",
  availability: "Based in Gujranwala, Pakistan. Open to full-stack roles and freelance work.",

  // Links: leave a value empty ("") and its button stays hidden until you fill it in.
  resume: "",     // e.g. "assets/resume.pdf"  (put your PDF in the assets folder)
  email: "muhammadassam33@gmail.com",      // e.g. "assam@gmail.com"
  github: "https://github.com/assam-dev",     // e.g. "https://github.com/your-username"
  linkedin: "https://www.linkedin.com/in/m-assam-a70321367",   // e.g. "https://www.linkedin.com/in/your-profile"

  skills: [
    { cat: "Languages", items: [
      ["JavaScript", "The language I think in, front to back."],
      ["Python", "Back-end logic, scripts and automation."],
      ["SQL", "Queries, joins and clean schemas."],
      ["HTML5 / CSS", "Semantic markup, layouts, animations."] ] },
    { cat: "Frontend", items: [
      ["React", "Component-driven interfaces with hooks."],
      ["Tailwind CSS", "Utility-first styling that stays consistent."],
      ["Bootstrap", "Fast, responsive layouts."],
      ["Responsive design", "Pages that work on every screen size."] ] },
    { cat: "Backend", items: [
      ["Node.js", "Event-driven servers and tooling."],
      ["Express", "Lean REST APIs with clear middleware."],
      ["Django", "Batteries-included Python web apps."],
      ["REST APIs", "Clear endpoints the front end can rely on."],
      ["JWT / Auth", "Sign-in, sessions and protected routes."] ] },
    { cat: "Databases", items: [
      ["MongoDB", "Flexible documents and aggregations."],
      ["MySQL", "Relational data with indexes and joins."],
      ["PostgreSQL", "Reliable relational storage."] ] },
    { cat: "Tools", items: [
      ["Git / GitHub", "Branches, pull requests and reviews."],
      ["Postman", "Testing and documenting APIs."],
      ["Vercel / Netlify", "A deploy on every push."],
      ["Figma", "Clean hand-off from design to code."],
      ["Wordpress / Woocommerce", "Develop shopify and e-commerce websites."]] }
  ],

  // SAMPLE PROJECTS: replace these with your own.
  // First three are featured; the rest appear under “View all projects”.
  // live / code: links (leave "" to hide).  image: optional screenshot, e.g. "assets/img/projects/my-app.jpg" (16:9).
  // Without an image, a preview illustration is drawn in the project’s accent colour.
  projects: [
    { title: "Ledgerline", cat: "Fintech · Full-stack", accent: "#e8a94f", kind: "dashboard",
      desc: "A budgeting app that sorts bank transactions into categories automatically and shows where each month’s money went.",
      tags: ["React", "Node.js", "PostgreSQL", "Prisma", "Chart.js"], live: "", code: "", image: "" },
    { title: "Thread & Co.", cat: "Commerce · MERN", accent: "#e2559c", kind: "shop",
      desc: "A clothing storefront with search, cart, Stripe checkout, order tracking and an admin dashboard for inventory.",
      tags: ["React", "Node.js", "Express", "MongoDB", "Stripe"], live: "", code: "", image: "" },
    { title: "Huddle", cat: "Realtime · WebSockets", accent: "#4ea6ea", kind: "chat",
      desc: "Team chat with channels, direct messages, typing indicators, read receipts and file sharing.",
      tags: ["React", "Socket.IO", "Node.js", "Redis", "Cloudinary"], live: "", code: "", image: "" },
    { title: "Gatekeeper", cat: "Security · Node", accent: "#4fd18b", kind: "auth",
      desc: "A drop-in authentication service: role-based access, one-time passcodes, refresh-token rotation and rate limiting.",
      tags: ["Node.js", "Express", "PostgreSQL", "JWT", "Zod"], live: "", code: "", image: "" },
    { title: "DocChat", cat: "AI · RAG", accent: "#9479f2", kind: "docs",
      desc: "Ask questions about your PDFs and get answers that cite the exact page they came from.",
      tags: ["FastAPI", "LangChain", "React", "pgvector"], live: "", code: "", image: "" }
  ],

  journey: [
    { title: "Foundations", text: "Started a BS in Computer Science at the University of Gujrat and fell for the web: HTML, CSS and JavaScript." },
    { title: "Going full-stack", text: "Learned React, back-end frameworks and databases, and built my first complete applications end to end." },
    { title: "Meta certified", text: "Earned the Meta Full Stack Developer certificate, covering both the front end and the back end." },
    { title: "Six months in the field", text: "Six months of hands-on experience building and shipping features for real web projects." },
    { title: "What’s next", text: "Open to full-stack roles and freelance work, and going deeper into scalable back ends and cloud deployment." }
  ]
};
