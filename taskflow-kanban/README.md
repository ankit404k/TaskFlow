# 📊 TaskFlow - Professional Kanban Board

A **market-ready, feature-rich Kanban board** application built with vanilla JavaScript, featuring professional UI/UX patterns and enterprise-grade functionality.

## ✨ Features

### Core Features
✅ **Drag & Drop** - Smooth task management between columns  
✅ **Real-time Search** - Filter tasks by text, priority, or tags  
✅ **Dark Mode** - Professional dark theme support  
✅ **Undo/Redo** - Full history tracking (Ctrl+Z, Ctrl+Y)  
✅ **Statistics Dashboard** - Real-time analytics and insights  
✅ **Auto-Save** - All changes saved to LocalStorage  

### Advanced Features
✅ **Task Details** - Full CRUD with rich editing modal  
✅ **Due Dates** - Track deadlines with overdue indicators  
✅ **Priority Tags** - Color-coded high/medium/low priorities  
✅ **Time Estimation** - Hour-based task time tracking  
✅ **Custom Tags** - Categorize tasks with custom labels  
✅ **Descriptions** - Add detailed task notes  
✅ **Export to JSON** - Backup and share boards  
✅ **Keyboard Shortcuts** - Power user friendly  
✅ **Toast Notifications** - Real-time feedback  
✅ **Responsive Design** - Mobile & tablet friendly  

## 🚀 Quick Start

### Installation
1. Clone or download the repository
2. Open `index.html` in a modern browser
3. Start creating tasks!

```bash
# No build process required - just open in browser
open index.html
```

## 🎮 Usage Guide

### Creating Tasks
- Click **"+ Add Task"** button
- Or use **Ctrl+N** keyboard shortcut
- Fill in task details:
  - Title (required)
  - Priority (high/medium/low)
  - Due date (optional)
  - Description (optional)
  - Tags (comma-separated)
  - Time estimate in hours

### Moving Tasks
- **Drag & drop** tasks between columns (To Do → In Progress → Done)
- Alternatively, use edit modal to change status

### Searching
- Use the **search bar** to filter tasks
- Or press **/** to focus search
- Searches by text, priority, and tags

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` | Redo last action |
| `Ctrl + N` | Create new task |
| `Ctrl + S` | Export to JSON file |
| `/` | Focus search bar |
| `Esc` | Close modal/search |

### Dark Mode
- Click the **🌙** icon in header
- Preference saved automatically

### Statistics
- Click **📈** icon to view analytics
- See completion rates, priority distribution
- Monitor task progress

### Editing & Deleting
- Click **✎ Edit** to modify task details
- Click **🗑️ Delete** to remove task
- Click **Clear All** to reset board

## 🏗️ Architecture

### Data Structure
```javascript
let boards = {
    todo: [
        { 
            id: 1, 
            text: "Task title", 
            priority: "high", 
            status: "todo",
            dueDate: "2026-03-01",
            description: "Details...",
            tags: ["urgent", "feature"],
            estimate: 3
        }
    ],
    doing: [],
    done: []
};
```

### Key Technologies
- **Vanilla JavaScript** - No frameworks/dependencies
- **Drag & Drop API** - Native HTML5 implementation
- **LocalStorage** - Persistent data storage
- **CSS Grid/Flexbox** - Responsive layout
- **Glass Morphism** - Modern UI design
- **Event Delegation** - Efficient event handling

## 🎨 Design Highlights

### UI/UX Features
- **Glass Morphism Design** - Transparent, frosted glass effect
- **Gradient Background** - Professional purple gradient
- **Smooth Animations** - Polished transitions
- **Color-coded Priorities** - Visual hierarchy
- **Overdue Indicators** - Red highlights for due tasks
- **Empty States** - Clear drop zone messaging
- **Drag Handles** - Visual feedback for draggability

### Responsive
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 💾 Data Persistence

All data is automatically saved to browser's LocalStorage:
- `kanbanBoard` - Complete board state
- `nextId` - Next task ID counter
- `darkMode` - Theme preference

**Note:** Data persists only in the same browser. To backup:
1. Click **🌙 → Export** 
2. Or use **Ctrl+S**
3. Download JSON file

## 🔒 Security Features

- **XSS Prevention** - HTML escaping on all user input
- **No Backend Required** - 100% client-side
- **No External APIs** - Privacy guaranteed
- **Local Storage Only** - Data never leaves your device

## 📊 Statistics Dashboard

Real-time insights include:
- **Total Tasks** - Count of all tasks
- **Completed** - Tasks in "Done" column
- **In Progress** - Tasks in "Doing" column
- **Completion Rate** - Percentage of done tasks
- **Priority Distribution** - Visual breakdown by priority

## 🎯 Undo/Redo System

- Maintains up to **20 history states**
- Automatic saving on every action
- Perfect for exploring changes risk-free
- Keyboard shortcuts: **Ctrl+Z** / **Ctrl+Y**

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance

- **Lightweight** - Under 50KB uncompressed
- **Fast Rendering** - Instant DOM updates
- **No Lag** - Smooth drag & drop
- **Optimized** - Efficient event delegation

## 🎓 Learning Value

Great for learning:
- **Vanilla JavaScript** patterns
- **Drag & Drop API** implementation
- **LocalStorage** usage
- **State Management** without frameworks
- **Responsive CSS** design
- **Accessibility** best practices
- **Event Handling** strategies

## 📄 File Structure

```
taskflow-kanban/
├── index.html      # HTML structure with modals
├── style.css       # Complete styling (dark mode included)
├── script.js       # Advanced JavaScript logic
└── README.md       # This file
```

## 🤝 Contributing

This is a **complete, production-ready project**. Feel free to:
- Fork and customize
- Add new features
- Share improvements
- Use as learning resource

## 📝 License

Free to use and modify for personal or commercial projects.

## 🎉 Ready to Use!

Just open `index.html` in your browser and start organizing your tasks like a pro! 🚀

---

**TaskFlow** - Built with ❤️ for productive teams  
*Your tasks, organized beautifully.*
