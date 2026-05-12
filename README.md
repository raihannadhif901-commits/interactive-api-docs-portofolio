# Interactive API Docs Builder

**[Live Demo: https://api-docs-portofoliovercelapp.vercel.app/](https://api-docs-portofoliovercelapp.vercel.app/)**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shiki](https://img.shields.io/badge/Shiki-Highlighter-blueviolet?style=for-the-badge)

A highly responsive, minimalist, and developer-first Interactive API Documentation builder. Inspired by the clean aesthetics of top-tier enterprise platforms (like Stripe and GitHub), this tool parses API endpoints and provides a real-time playground to test HTTP requests without CORS limitations.

Currently configured as a **Live Showcase** interacting directly with the **GitHub REST API**.

## Preview

<img width="959" height="439" alt="image" src="https://github.com/user-attachments/assets/8bab2aa2-7956-496f-9d99-d922a3c57269" />


## Key Features

- **Live API Proxying:** Built-in Next.js Route Handlers (`/api/proxy`) to securely proxy cross-origin HTTP requests.
- **Dynamic Code Generation:** Automatically generates cURL and `fetch` JavaScript snippets based on user inputs in real-time.
- **VS Code-Grade Highlighting:** Utilizes **[Shiki](https://shiki.style/)** for extremely accurate and beautiful syntax highlighting.
- **Strict Theming (Dark/Light Mode):** Engineered with `next-themes` and CSS variables for a flawless, flicker-free toggle between a bright GitHub-style light mode and a hacker-style deep dark mode.
- **Dynamic Edge Favicon:** Programmatically generated browser icon using Next.js `ImageResponse` at the edge runtime.

## Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (with strict CSS variable theming)
- **Syntax Highlighter:** Shiki
- **Icons:** Lucide React
- **Theme Management:** Next-Themes

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/raihannadhif901-commits/interactive-api-docs.git
   cd interactive-api-docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How it Works

The application is structured in a highly efficient 3-column layout:
1. **Sidebar Navigation:** Maps the API specifications (Paths & Methods).
2. **Parameters Panel:** A dynamic form that extracts query/path requirements.
3. **Execution Panel:** The interactive black-box that streams the expected payload or outputs the actual live JSON response fetched from the server.

By default, the application is set up to interact with the public GitHub REST API. To test it, click on the `GET /users/{username}` endpoint, type a GitHub username, and hit **Send Request**!

## License

This project is open-sourced and available under the [MIT License](LICENSE).
