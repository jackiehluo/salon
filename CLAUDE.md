# Claude Instructions for this project

## CRITICAL: Never truncate or shorten text content

When editing `data.json`:
- **NEVER** truncate, shorten, summarize, or use "..." in the `content` field of any guest's intellectual or emotional entries
- The full text content must always be preserved exactly as provided
- If you need to edit data.json, re-fetch the full content from Airtable first to ensure nothing is lost
- This applies to ALL guests, not just the host

## Workflow: Adding/Updating Guests

### 1. Pull from Airtable
```bash
source .env
curl -s "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/Table%201" \
  -H "Authorization: Bearer $AIRTABLE_API_KEY"
```

### 2. For each person, fetch and process:
- **Photos**: Download profile images to `photos/` folder (use lowercase firstname, e.g., `photos/alice.jpg`)
- **Bio links**: Fetch their website/social links to enrich their bio with personal details
- **Text URLs**: For any intellectual/emotional resonance that's a URL, fetch and summarize the content

### 3. Create summaries and bios
- **Text summaries**: Rich, detailed summaries with key concepts, quotes, and themes (see existing summaries for tone)
- **Bios**: Personal details about the person—NOT referencing their text picks. Use info from their Airtable submission + fetched links. Color and nuance for matching purposes.
- **Themes**: Array of 5-8 thematic keywords for each text

### 4. Generate matches
- Each person gets 3 matches from other guests
- Each match has: `name`, `reason` (why they'd connect), `question` (conversation starter)
- Match based on **intellectual pick, emotional pick, OR bio**—use judgment for what would spark the best conversation
- Questions should tie back to the texts
- Balance matches across both texts (don't make all 3 about one piece)
- Draw connections between different guests' texts and lives—thematic, philosophical, emotional

### 5. Update data.json
- Add new guests or update existing ones
- Preserve ALL existing content exactly (never truncate)
- Sort guests alphabetically by name in the file

### Git commits
- 100% lowercase
- Clean summary title only, no body
- No co-author line
- Example: `add camille vargas, enrich bios`

### 6. Report what's missing
At the end, tell the user:
- Which photos couldn't be downloaded (need manual fetch)
- Which URLs couldn't be fetched (blocked, require login, etc.)
- Which bios need enrichment from sources you can't access (Twitter, Instagram, etc.)

## Data structure

```json
{
  "name": "Full Name",
  "photo": "photos/firstname.jpg",
  "tagline": "3-5 word description ending in noun",
  "bio": "Rich personal details for matching, NOT referencing text picks",
  "bioUrl": "primary link",
  "intellectual": {
    "title": "Title of work",
    "content": "URL or full text (NEVER truncated)",
    "summary": "Rich summary with key concepts",
    "themes": ["theme1", "theme2", ...]
  },
  "emotional": {
    "title": "Title of work",
    "content": "URL or full text (NEVER truncated)",
    "summary": "Rich summary with key concepts",
    "themes": ["theme1", "theme2", ...]
  },
  "matches": [
    {
      "name": "Other Guest",
      "reason": "Why they connect",
      "question": "Conversation starter"
    }
  ]
}
```

Note: `intellectual` and `emotional` can be arrays if someone submitted multiple texts.
