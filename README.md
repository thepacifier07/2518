# School Static Site Starter

A simple static website for showing question-answer content by class, subject, and chapter.

## Project structure

- `index.html` - main page
- `styles.css` - site styles
- `app.js` - loads catalog and chapter content
- `data/catalog.json` - class and subject index
- `data/*.json` - one JSON file per class/subject
- `source-data.json` - single source file for bulk generation
- `generate-json.js` - converts `source-data.json` into the `data/` files

## How it works

1. User selects a class.
2. Subjects for that class are loaded.
3. User selects a subject.
4. Chapters for that subject are loaded.
5. User selects a chapter.
6. Questions and answers are shown.

## Run locally

You can open with a local server.

### Python
```bash
python -m http.server 8000
```

Then open `http://localhost:8000`

### Node
```bash
npx serve .
```

## Update content

Edit `source-data.json` and run:

```bash
node generate-json.js
```

This will recreate:
- `data/catalog.json`
- one JSON file per class/subject

## Upload to Git

Push this folder to your Git repository. It works well with:
- GitHub Pages
- Netlify
- Vercel static hosting
