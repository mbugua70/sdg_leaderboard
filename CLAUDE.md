# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `bun dev` (runs on http://localhost:3000)
- **Build:** `bun run build`
- **Start production:** `bun start`
- **Lint:** `bun lint`

Package manager is **bun** (see `bun.lock`).

## Architecture

- **Next.js 16** app using the App Router (`app/` directory)
- **React 19** with TypeScript (strict mode)
- **Tailwind CSS v4** via PostCSS
- **Geist** font family (sans + mono) loaded via `next/font`
- Path alias: `@/*` maps to the project root
- ESLint configured with `next/core-web-vitals` and `next/typescript` rulesets
