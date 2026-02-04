# Missing Features - Inspiration Project Implementation

Based on the screenshots in `/inspiration/sandcastles.ai/Screenshots/Not added yet/`, the following features are missing from the inspiration project and need to be implemented.

## 1. Watchlists Feature
- [ ] Create Watchlists page (`/dashboard/watchlists`)
    - [ ] Display list of user's watchlists with channel count and avatars
    - [ ] "Add new channel" button in header
    - [ ] Left sidebar showing new channels added today
    - [ ] Create new watchlist functionality
- [ ] Create Watchlist Details page (`/dashboard/watchlists/:id`)
    - [ ] Show watchlist name and description
    - [ ] Display all channels in the watchlist with details
    - [ ] Channel actions (Edit video, Actions dropdown)
    - [ ] Popular topics tags for each channel
    - [ ] "Start your free trial" CTA section

## 2. Videos Table View
- [ ] Enhance Videos page with table view option
    - [ ] Add table/grid view toggle
    - [ ] Implement table layout with columns:
        - [ ] Video thumbnail and title
        - [ ] Outlier score (with color indicator)
        - [ ] Platform icon
        - [ ] Views count
        - [ ] Engagement rate
        - [ ] Posted date
    - [ ] Add hover actions on table rows
    - [ ] Implement row selection

## 3. Enhanced Script Writer (Multi-step Wizard)
- [ ] Refactor Writer page to multi-step wizard
    - [ ] **Step 1: Topic & Research**
        - [ ] Topic input field with "Describe your topic" prompt
        - [ ] "How to write the best prompt" help link
        - [ ] Research section (optional)
        - [ ] Processing state UI
        - [ ] Research results display
    - [ ] **Step 2: Pick Hook**
        - [ ] Filter by tag dropdown
        - [ ] Search vault functionality
        - [ ] Hook template cards with thumbnails and view counts
        - [ ] Multi-select hook capability
        - [ ] Selected hooks preview
    - [ ] **Step 3: Choose Style**
        - [ ] Filter by tag dropdown
        - [ ] Search vault for styles
        - [ ] Style template cards with thumbnails and view counts
        - [ ] "Load more" pagination
    - [ ] **Step 4: Write Script**
        - [ ] Generated script editor
        - [ ] Word count display
        - [ ] Script actions (regenerate, copy, download, etc.)
        - [ ] View history feature
        - [ ] Jump navigation between steps
- [ ] Create "Scripting Ingredients" documentation/help page
    - [ ] Explain 7 core variables (Topic, Angle, Hook Format, Story Format/Style, Visual Format, Visuals, Audio)

## 4. Videos Filtering System
- [ ] Enhance Videos page filters
    - [ ] Saved filters section
    - [ ] Watchlist filter integration
    - [ ] Channel filter
    - [ ] Posted date filter
    - [ ] Platform filter
    - [ ] Outlier score filter
    - [ ] Views filter
    - [ ] Engagement rate filter
    - [ ] "Clear" and "Save" filter actions

## 5. Additional Enhancements
- [ ] Add processing/loading states for async operations
- [ ] Implement history tracking for script generation
- [ ] Create reusable filter component
- [ ] Add multi-select capability to various lists

---

## Implementation Priority
1. **Phase 1**: Videos Table View & Filtering (most impactful for discovery)
2. **Phase 2**: Enhanced Script Writer Wizard (core feature improvement)
3. **Phase 3**: Watchlists Feature (new organizational capability)
4. **Phase 4**: Documentation & Help Content
