# Hobby Tracker App - Design Document

## Project Overview

**Anniversary Gift for Cat**  
*Launch Date: September 1st - First Anniversary*

A personalized web application to help track hobby progress and discover local venues in Islington, encouraging exploration of new interests while building community connections.

## Core Concept

Three main hobbies: **Piano**, **Pottery**, and **Pilates** (the 3 P's!)
- Track progress visually
- Discover local venues
- Build neighborhood connections
- Celebrate personal growth

## Visual Design

### Login Page
- **Artistic Theme**: Three beautiful illustrations representing each hobby
  - Piano: Elegant grand piano silhouette
  - Pottery: Clay pot on a wheel with artistic hands
  - Pilates: Graceful woman in pilates pose
- **Password**: `icandothis` (motivational and personal)
- **Design Style**: Minimalist, warm, encouraging

### Main Dashboard
- **Three Vertical Progress Bars**: One for each hobby
- **Interactive Controls**: Red "-" and green "+" buttons
- **Progress Visualization**: Squares/circles that fill up as activities increase
- **Smart Suggestions**: "Discover nearby spots" link for each activity

## Features

### 1. Activity Tracking
- Visual progress bars for each hobby
- Simple increment/decrement controls
- Persistent data storage (localStorage)
- Celebration milestones (every 5th session)

### 2. Local Discovery
- Curated list of top 5 venues per activity
- Real locations around Islington N7 0FQ
- Links and contact information
- Encouraging copy to motivate exploration

### 3. User Experience
- One-time password entry (remembered in session)
- Instant feedback on interactions
- Motivational messaging
- Beautiful, Instagram-worthy design

## Research: Top 5 Venues by Activity

### Piano Lessons
1. **Islington Piano Teachers** - Home lessons across Islington
2. **Piece of Music** - In-person lessons with exam prep
3. **Music Tree** - Multi-genre lessons for all ages
4. **Doremifa Piano School** - Classical training focus
5. **North Islington Piano Lessons** - Strong foundation building

### Pottery Classes
1. **Lesley McShea** - Informal ceramics workshops (Stoke Newington)
2. **Noar Ceramics** - One-to-one pottery throwing classes
3. **Culford Studios** - Professional artists offering workshops
4. **Clay Time** - Community studio on Blackstock Road
5. **Turning Earth Highgate** - Membership-based pottery facilities

### Pilates Classes
1. **Pilates Central** - Personalized sessions
2. **Frame Islington** - Reformer and mat classes
3. **Ten Health & Fitness** - Dynamic reformer Pilates
4. **The Pilates Room** - Boutique studio with small groups
5. **Islington Pilates** - Welcoming environment for all levels

## Technical Implementation

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Modern CSS with animations
- **Storage**: Browser localStorage
- **Assets**: SVG icons and illustrations
- **Deployment**: Simple file serving for local testing

### File Structure
```
hobby-tracker/
├── index.html (Login page)
├── dashboard.html (Main app)
├── style.css (All styles)
├── script.js (All functionality)
├── assets/
│   ├── piano-icon.svg
│   ├── pottery-icon.svg
│   └── pilates-icon.svg
└── README.md
```

### Data Structure
```javascript
{
  piano: { count: 0, venues: [...] },
  pottery: { count: 0, venues: [...] },
  pilates: { count: 0, venues: [...] }
}
```

## User Journey

1. **Entry**: Beautiful login page with password "icandothis"
2. **Discovery**: Clean dashboard showing three hobby trackers
3. **Tracking**: Easy +/- controls to log activities
4. **Exploration**: "Discover nearby spots" reveals local venues
5. **Motivation**: Visual progress encourages continued engagement

## Success Metrics

- **Engagement**: Regular use of tracking features
- **Discovery**: Clicking on venue suggestions
- **Growth**: Increasing activity counts over time
- **Joy**: Positive emotional response to the gift

## Future Enhancements (Post-Anniversary)

- Photo uploads for each session
- Notes/journal entries
- Achievement badges
- Social sharing features
- Venue reviews and ratings
- Calendar integration

## Development Timeline

- **Phase 1**: Design document ✓
- **Phase 2**: Login page with artistic design
- **Phase 3**: Dashboard with progress tracking
- **Phase 4**: Venue discovery feature
- **Phase 5**: Polish and testing
- **Phase 6**: Local deployment ready

---

*Created with love for our first anniversary 💕*
