# Versaace.com — Website

Static website for **versaace.com**, a store selling iPhones and other Apple
devices (MacBook, iPad, Apple Watch, AirPods) plus services like repairs,
trade-ins and business orders.

## Stack

Pure HTML + CSS + vanilla JavaScript — no build step, no dependencies.

- `index.html` — single-page site (hero, iPhone lineup, devices, services, trade-in estimator, why-us, contact)
- `styles.css` — dark/gold premium theme, fully responsive
- `script.js` — mobile nav, product filters, trade-in estimator, contact form (mailto handoff)

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
cd versaace
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Any static host works (Azure Static Web Apps, GitHub Pages, Netlify, Vercel,
Cloudflare Pages). Point the host at this `versaace/` folder — there is no
build command and the output location is the folder itself.

For the existing Azure Static Web Apps workflow in this repo, a separate Static
Web App can be created with `app_location: "./versaace"` and an empty
`output_location`, then map the custom domain `versaace.com` in the Azure
portal.

## Customising

- Contact details: search for `sales@versaace.com` and `+1 (000) 000-0000` in
  `index.html` and `script.js` and replace with real ones.
- Prices and models: edit the product cards in `index.html` and the trade-in
  values in the `#tiModel` select options.
