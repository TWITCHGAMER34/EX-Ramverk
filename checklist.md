# Where It's @ — Frontend Implementation Checklist

## Suggested Project Structure
`src/`
- `assets/` \- images, fonts, icons
- `components/` \- reusable components (Button, Card, Header, Footer, etc.)
- `pages/` \- page components (Home, EventDetail, Checkout, Confirmation, Profile)
- `store/` \- Zustand store setup
- `api/` \- API wrappers (e.g., `events.ts`)
- `utils/` \- utility functions (ticket id, seat allocator)
- `styles/` \- global and component styles

## Fonts & Global Styles
- Option A (static): place font files in `public/fonts` and reference as `/fonts/...` in `@font-face`.
- Option B (bundler): place fonts in `src/assets/fonts` and reference relative to `src/styles/Global.scss`. Ensure `src/styles/Global.scss` is imported in `src/index.tsx`.
- Use `font-display: swap` and include formats (`.woff2`, `.woff`, `.ttf`) when available.
- Centralize variables in `src/styles/variables.scss`.

## Routing & Pages
- Configure `react-router-dom` with routes for `Home`, `EventDetail`, `Checkout`, `Confirm`.
- Use route params like `/events/:id`.
- Each page should fetch its data (`useEffect` + `useState` or a chosen data lib).
- Ensure navigation and layout adapt for viewports 375–500px.

## API handling
- Create `src/api/events.ts` with an axios or fetch wrapper for `https://santosnr6.github.io/Data/events.json`.
- Implement loading and error states and surface them in the UI.
- Abstract calls for easy mocking in tests.

## State Management (Zustand)
Create `src/store/useStore.ts` with:
- selected event
- cart / pending tickets
- reserved/sold seats per event  
  Expose actions: `addTicket`, `removeTicket`, `reserveSeats`, `confirmPurchase`, `clearCart`.  
  Consider persisting cart to `localStorage` for improved UX.

## Components & Props
Build modular, typed components:
- `EventCard` \- receives event data via props
- `SeatPicker` \- visual seat selection
- `TicketSummary` \- shows generated tickets
- `QuantitySelector` \- increments/decrements
- `Header`, `Footer`, `Loader`, `ErrorBanner`  
  Keep local state with `useState` where appropriate; lift state when needed.  
  Type props with TypeScript interfaces.

## Ticket creation rules (must satisfy)
- Ticket ID: 5 characters, uppercase letters and digits only. Pattern: `[A-Z0-9]{5}`.
- Section & seats:
    - Choose a single section per purchase; multiple tickets for same event must use the same section.
    - Assign adjacent seat numbers within the chosen section.
- Persist generated tickets in Zustand; on confirmation mark seats sold/reserved.
- Provide a printable/savable ticket view on confirmation.

## Seat allocation algorithm (summary)
- Maintain reserved/sold seat arrays per section per event.
- To allocate `N` seats:
    1. Scan seat numbers in the chosen section for `N` consecutive free slots (sliding window).
    2. If found, reserve and return those seat numbers.
    3. If not found, try other sections or return a helpful error/suggestion.
- Edge cases:
    - If `N` exceeds section capacity, show validation error.
    - Provide best-effort suggestions when exact adjacency is impossible.

## Accessibility & Responsive Design
- Use semantic HTML (\`\<button\>\`, headings, lists) and visible focus states.
- Ensure keyboard navigation and screen-reader labels (`aria-label`, `aria-live`).
- Meet color-contrast WCAG AA.
- Test viewports: 375px, 414px, 480px, 500px.
- Provide alt text for images and ensure interactive elements are reachable.

## Error Handling & Stability
- Wrap async calls in `try` / `catch` and display user-friendly messages.
- Validate inputs (`quantity > 0`, max tickets per order).
- Use defensive guards for data access to avoid render crashes.
- Add an Error Boundary to catch unexpected runtime exceptions.

## Testing & Verification
- Manual test flows:
    - Browse events → open detail → select quantity → checkout → confirm → view tickets.
    - Multiple-ticket purchase: verify same section and adjacent seats.
    - API unavailable: verify fallback UI.
- Unit tests for utilities (`ticketIdGenerator`, `seatAllocator`).
- Component tests for critical components (`EventCard`, `SeatPicker`).
- Run Lighthouse / Axe accessibility checks.
- Optional: integration tests for checkout flow.

## README & Documentation (required)
- Include run instructions:
    - `npm install`
    - `npm start`
    - `npm run build`
- Document project structure and the 3 chosen external libraries for VG: why each was chosen and how it integrates with the app.
- Document assumptions (seat layout, section names, ticket limits) and testing steps.
- Explain how to switch font loading modes (public vs bundler) if relevant.

## Final Checks Before Submission
- Verify all flows on mobile widths (375–500px).
- Run accessibility audit and fix critical issues.
- Ensure app never crashes if API is unavailable; show fallback UI.
- Confirm ticket IDs match the `[A-Z0-9]{5}` format and seat allocation rules hold.
- Update README with chosen libraries and test instructions.
- Clean repository with meaningful commits.

## Optional (for VG)
Implement and document 3 external libraries not covered in class (examples):
- `Framer Motion` \- animations and transitions.
- `Swiper` \- carousel for featured events.
- `Material UI` \- consistent component set.  
  Explain in README how each library hooks into the app and why it fits.

## Useful snippets / helpers (add to `src/utils/`)
### Ticket ID generator (example)
- Behavior: generate a 5-char string with uppercase A-Z and digits 0-9.
- Use secure randomness (or combine randomness + timestamp) to reduce collisions.

### Seat allocator (example)
- Input: `sectionSeats` (total seats per section), `reservedSeats` (array), `quantity`.
- Output: array of consecutive seat numbers or `null` if not available.
- Implementation tip: use a sliding window over seat indexes and mark seats reserved in the store once allocation succeeds.

<hr>
