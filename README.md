# Assann Dashboard

Personal mission-control dashboard for the 2026–2027 year.

## V1

- Tabbed interface: Overview, Habits, Projects, Calendar, Analytics, Opportunities
- Interactive habit tracker
- Habit history persisted in browser `localStorage`
- Project portfolio: current / future / ideas
- Responsive desktop/mobile layout
- GitHub Pages deployment workflow
- Architecture ready for ENSMA Mirror / Google Calendar data integration

## Privacy

The current V1 does not expose Google or ENSMA credentials. Habit data is stored only in the browser that records it. A future authenticated backend will provide multi-device synchronization.

## Next milestones

1. Enable GitHub Pages with **GitHub Actions** as the source.
2. Verify the deployed dashboard on desktop and mobile.
3. Add automatic read-only calendar data generation.
4. Add authenticated cloud persistence for habits/projects.
