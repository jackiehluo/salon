# jackie's birthday salon

a little web app for a birthday salon where guests share chosen works that resonate intellectually and emotionally and get matched with conversation partners.

## run locally

```bash
python3 -m http.server 8080
```

then open http://localhost:8080

## deploy

push to github and enable github pages, or drop the files anywhere static.

## structure

```
salon/
├── index.html      # main page
├── style.css       # left bank literati styling
├── script.js       # loads data, renders cards, handles modals
├── data.json       # guest data with chosen works and matches
├── photos/         # guest photos
├── .env            # airtable credentials (not committed)
└── CLAUDE.md       # instructions for updating guest data
```
