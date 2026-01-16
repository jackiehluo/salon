# Claude Instructions

## Rules
- **Never truncate text content** — preserve `content` fields exactly as provided
- **Git commits** — lowercase, title only, no body, no co-author

## Adding/Updating Guests

1. **Pull from Airtable**
   ```bash
   source .env
   curl -s "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/Table%201" \
     -H "Authorization: Bearer $AIRTABLE_API_KEY"
   ```

2. **Fetch & process** — download photos to `photos/`, fetch bio links and text URLs

3. **Create content**
   - *Summaries*: rich, detailed, with key concepts and quotes
   - *Bios*: personal details from Airtable + links (don't reference text picks)
   - *Themes*: 5-8 keywords per text
   - *Taglines*: 3-5 words ending in a noun

4. **Generate matches** — 3 per person, based on texts and/or bio, balance across both picks

   *Reasons should:*
   - Connect specific ideas/themes between texts, or find resonance with bios (not just "you both like X")
   - Find thematic resonance, productive tension, or unexpected complement
   - Reference actual concepts, quotes, or arguments from the works

   *Questions should:*
   - Engage with the intellectual content of the texts
   - Invite personal reflection or application (not just "what do you think of X?")
   - Be specific enough to spark real conversation, open enough to go deep
   - Avoid generic icebreakers

   *Balance academic + personal:*
   - Academic: "Steyerl argues poor images embody 'reality' by revealing conditions of circulation."
   - Personal: "What has a degraded image taught you that a crisp one couldn't?"

5. **Update data.json** — alphabetize by name, preserve all content

6. **Report gaps** — photos that need manual download, URLs that couldn't be fetched, bios needing enrichment

## Data Structure

```json
{
  "name": "Full Name",
  "photo": "photos/firstname.jpg",
  "tagline": "3-5 words ending in noun",
  "bio": "Personal details for matching",
  "bioUrl": "primary link",
  "intellectual": {
    "title": "Title",
    "content": "URL or full text",
    "blurb": "Guest's own commentary (optional)",
    "summary": "Rich summary",
    "themes": ["theme1", "theme2"]
  },
  "emotional": { ... },
  "matches": [
    { "name": "Guest", "reason": "Why", "question": "Starter" }
  ]
}
```

`intellectual` and `emotional` can be arrays for multiple texts.

If guest provides both a link and commentary, use `content` for the URL and `blurb` for their text. Modal shows the blurb with a "View the work" link.
