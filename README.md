# Franchico — Musician Portfolio

A creative, interactive portfolio for a musician, bassist, guitarist, drummer, producer, and content creator. Features a modular draggable window interface inspired by [gmbgraphic.com](https://www.gmbgraphic.com/).

## Features

- **Modular window interface** — All pages (Home, Gallery, Reels, About) can be opened simultaneously as draggable windows
- **Draggable music player** — Pop-up player inspired by [sosoradio.co](https://www.sosoradio.co)
- **GMB-inspired design** — Minimal, bold typography, dark palette, editorial layout
- **Scrollable content** — Each window has its own scrollable area

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- react-draggable

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  components/
    Window/       # Draggable window wrapper
    MusicPlayer/   # Draggable music player
    Gallery/       # Photo gallery
    Reels/         # Video reels/shorts
    About/         # About page
    Home/          # Landing
  App.jsx
  main.jsx
```

## Reference

See `INSTRUCTIONS.txt` for full project specs, style references, and implementation notes.
