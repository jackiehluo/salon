# jackie's birthday salon

a little web app for a birthday salon where guests share texts that resonate intellectually and emotionally, and get matched with conversation partners.

## run locally

```bash
python3 -m http.server 8080
```

then open http://localhost:8080

## update guest data

1. fetch from airtable:
```bash
source .env
curl -s "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/Table%201" \
  -H "Authorization: Bearer $AIRTABLE_API_KEY"
```

2. update `data.json` with new guests, titles, and matches

3. download photos to `photos/` folder:
```bash
curl -sL "https://example.com/photo.jpg" -o photos/name.jpg
```

## deploy

push to github and enable github pages, or drop the files anywhere static.

## structure

```
salon/
├── index.html      # main page
├── style.css       # left bank literati styling
├── script.js       # loads data, renders cards, handles modals
├── data.json       # guest data with texts and matches
└── photos/         # local guest photos
```
