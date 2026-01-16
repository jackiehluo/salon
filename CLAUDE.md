# Claude Instructions for this project

## CRITICAL: Never truncate or shorten text content

When editing `data.json`:
- **NEVER** truncate, shorten, summarize, or use "..." in the `content` field of any guest's intellectual or emotional entries
- The full text content must always be preserved exactly as provided
- If you need to edit data.json, re-fetch the full content from Airtable first to ensure nothing is lost
- This applies to ALL guests, not just the host

## Fetching from Airtable

To get fresh data:
```bash
curl -s "https://api.airtable.com/v0/appBDjrGLjTz2Yj1o/Table%201" \
  -H "Authorization: Bearer $AIRTABLE_API_KEY"
```

The API key is in `.env`.
