// ===== ADVANCED STATE MANAGEMENT & UNDO/REDO SYSTEM =====
let boards = {
    todo: [
        { id: 1, text: "Design kanban board layout", priority: "high", status: "todo", dueDate: "2026-03-01", description: "Create professional UI mockups", tags: ["design", "urgent"], estimate: 5 },
        { id: 2, text: "Implement drag and drop", priority: "medium", status: "todo", dueDate: "", description: "", tags: [], estimate: 0 }
    ],
    doing: [
        { id: 3, text: "Write API documentation", priority: "high", status: "doing", dueDate: "2026-02-25", description: "", tags: ["documentation"], estimate: 3 }
    ],
    done: [
        { id: 4, text: "Setup project structure", priority: "low", status: "done", dueDate: "", description: "", tags: [], estimate: 0 }
    ]
};

let nextId = 5;
let currentColumn = null;

// Undo/Redo System
let history = [];
let historyIndex = -1;

// Other states
let darkMode = localStorage.getItem('darkMode') === 'true';
let searchQuery = '';
let editingTaskId = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    applyDarkMode();
    renderBoard();
    setupEventListeners();
    saveToHistory();
    updateStats();
});

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Search functionality
    document.getElementById('searchBox').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderBoard();
    });
    
    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTaskModal();
            hideHelp();
            hideStats();
        }
    });
    
    // Search focus on /
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !document.getElementById('searchBox').matches(':focus')) {
            e.preventDefault();
            document.getElementById('searchBox').focus();
        }
    });

    // Close stats panel when clicking outside
    document.addEventListener('click', (e) => {
        const statsPanel = document.getElementById('statsPanel');
        const helpModal = document.getElementById('helpModal');

        const clickedStatsButton = !!e.target.closest('.btn-icon[title="Statistics"]');
        const clickedHelpButton = !!e.target.closest('.btn-icon[title="Help"]');

        // Close stats panel when clicking outside and not clicking the stats button
        if (statsPanel && statsPanel.classList.contains('active') && !e.target.closest('#statsPanel') && !clickedStatsButton) {
            hideStats();
        }

        // Close help modal when clicking outside and not clicking the help button
        if (helpModal && helpModal.classList.contains('active') && !e.target.closest('#helpModal') && !clickedHelpButton) {
            hideHelp();
        }
    });
}

// ===== KEYBOARD SHORTCUTS =====
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
            e.preventDefault();
            undo();
        } else if (e.key === 'y') {
            e.preventDefault();
            redo();
        } else if (e.key === 'n') {
            e.preventDefault();
            addTask('todo');
        } else if (e.key === 's') {
            e.preventDefault();
            exportToFile();
        }
    }
}

// ===== RENDER BOARD WITH SEARCH FILTERING =====
function renderBoard() {
    ['todo', 'doing', 'done'].forEach(columnId => {
        let tasksArray = boards[columnId];
        
        // Apply search filter
        if (searchQuery) {
            tasksArray = tasksArray.filter(task => 
                task.text.toLowerCase().includes(searchQuery) ||
                task.priority.toLowerCase().includes(searchQuery) ||
                task.tags.some(tag => tag.toLowerCase().includes(searchQuery))
            );
        }
        
        const itemsContainer = document.getElementById(`${columnId}-items`);
        const taskCount = document.querySelector(`#${columnId} .task-count`);
        
        itemsContainer.innerHTML = '';
        taskCount.textContent = boards[columnId].length;
        
        // Add empty state
        if (tasksArray.length === 0) {
            itemsContainer.classList.add('empty');
            itemsContainer.innerHTML = `<div>Drop tasks here...</div>`;
        } else {
            itemsContainer.classList.remove('empty');
            tasksArray.forEach(task => {
                const taskElement = createTaskElement(task, columnId);
                itemsContainer.appendChild(taskElement);
            });
        }
    });
}

// ===== CREATE TASK ELEMENT WITH RICH FEATURES =====
function createTaskElement(task, columnId) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-card';
    taskDiv.draggable = true;
    taskDiv.id = `task-${task.id}`;
    taskDiv.ondragstart = (e) => drag(e, task.id, columnId);
    taskDiv.ondragend = dragEnd;

    // Touch / Mobile drag support
    taskDiv.addEventListener('touchstart', (e) => touchStart(e, task.id, columnId), { passive: false });
    taskDiv.addEventListener('touchmove', touchMove, { passive: false });
    taskDiv.addEventListener('touchend', touchEnd);
    
    // Format due date
    let dueDateHtml = '';
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const isOverdue = dueDate < today && task.status !== 'done';
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        dueDateHtml = `<span class="task-due-date ${isOverdue ? 'overdue' : ''}" title="Due in ${daysLeft} days">${task.dueDate}</span>`;
    }
    
    // Time estimate
    let estimateHtml = task.estimate > 0 ? `<span class="task-estimate">${task.estimate}h</span>` : '';
    
    // Tags
    let tagsHtml = task.tags.map(tag => `<span class="task-tag">${escapeHtml(tag)}</span>`).join('');
    
    taskDiv.innerHTML = `
        <span class="task-drag-handle">≡</span>
        <div class="task-card-header">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <span class="task-priority priority-${task.priority}">${task.priority}</span>
        </div>
        <div class="task-meta">
            ${dueDateHtml}
            ${estimateHtml}
        </div>
        ${tagsHtml ? `<div class="task-tags">${tagsHtml}</div>` : ''}
        <div class="task-actions">
            <button class="btn-edit" onclick="editTask(${task.id})">Edit</button>
            <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    
    return taskDiv;
}

// ===== Touch Drag Helpers for Mobile Devices =====
const touchDrag = {
    taskId: null,
    sourceColumn: null,
    clone: null,
    offsetX: 0,
    offsetY: 0
};

function touchStart(e, taskId, sourceColumn) {
    // Prevent scrolling while dragging
    e.preventDefault();
    const touch = e.touches[0];
    const orig = document.getElementById(`task-${taskId}`);
    if (!orig) return;

    touchDrag.taskId = taskId;
    touchDrag.sourceColumn = sourceColumn;

    // Create visual clone
    const rect = orig.getBoundingClientRect();
    touchDrag.offsetX = touch.clientX - rect.left;
    touchDrag.offsetY = touch.clientY - rect.top;

    const clone = orig.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.pointerEvents = 'none';
    clone.style.opacity = '0.95';
    clone.style.zIndex = 9999;
    document.body.appendChild(clone);
    touchDrag.clone = clone;

    // Add dragging class to original for visual feedback
    orig.classList.add('dragging');
}

function touchMove(e) {
    if (!touchDrag.clone) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchDrag.clone.style.left = `${touch.clientX - touchDrag.offsetX}px`;
    touchDrag.clone.style.top = `${touch.clientY - touchDrag.offsetY}px`;

    // Add drag-over state to column under touch
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
    const column = el?.closest?.('.kanban-column');
    if (column) column.classList.add('drag-over');
}

function touchEnd(e) {
    const clone = touchDrag.clone;
    const id = touchDrag.taskId;
    const src = touchDrag.sourceColumn;

    // Clean up dragging visuals
    if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
    touchDrag.clone = null;

    const orig = document.getElementById(`task-${id}`);
    if (orig) orig.classList.remove('dragging');

    // Determine drop target from last touch (use changedTouches or first touch)
    const touch = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]);
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetColumn = el?.closest?.('.kanban-column')?.id;

    if (!targetColumn || !src) {
        // remove any drag-over highlight
        document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
        touchDrag.taskId = null;
        touchDrag.sourceColumn = null;
        return;
    }

    // Perform move
    const taskId = parseInt(id);
    const task = boards[src].find(t => t.id === taskId);
    if (task) {
        boards[src] = boards[src].filter(t => t.id !== taskId);
        task.status = targetColumn;
        boards[targetColumn].push(task);
        saveToHistory();
        renderBoard();
        updateStats();
        saveToLocalStorage();
        showToast(`Task moved to ${targetColumn}`);
    }

    document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
    touchDrag.taskId = null;
    touchDrag.sourceColumn = null;
}

// ===== DRAG & DROP IMPLEMENTATION =====
function drag(event, taskId, sourceColumn) {
    currentColumn = sourceColumn;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('taskId', taskId);
    event.dataTransfer.setData('sourceColumn', sourceColumn);
    event.target.closest('.task-card').classList.add('dragging');
}

function dragEnd(event) {
    event.target.closest('.task-card').classList.remove('dragging');
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
    });
}

function allowDrop(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    const column = event.target.closest('.kanban-column');
    if (column) {
        column.classList.add('drag-over');
    }
}

document.addEventListener('dragover', (event) => {
    const column = event.target.closest('.kanban-column');
    if (column && event.target.closest('.kanban-items')) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        column.classList.add('drag-over');
    }
});

function drop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const taskId = parseInt(event.dataTransfer.getData('taskId'));
    const sourceColumn = event.dataTransfer.getData('sourceColumn');
    const targetColumn = event.target.closest('.kanban-column')?.id;
    
    if (!targetColumn) return;
    
    const task = boards[sourceColumn].find(t => t.id === taskId);
    
    if (task) {
        boards[sourceColumn] = boards[sourceColumn].filter(t => t.id !== taskId);
        task.status = targetColumn;
        boards[targetColumn].push(task);
        
        saveToHistory();
        renderBoard();
        updateStats();
        saveToLocalStorage();
        showToast(`Task moved to ${targetColumn}`);
    }
}

// ===== OPEN TASK MODAL FOR CREATION =====
function addTask(columnId) {
    editingTaskId = null;
    currentColumn = columnId;
    document.getElementById('modalTitle').textContent = 'Create New Task';
    document.getElementById('taskText').value = '';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskDueDate').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskTags').value = '';
    document.getElementById('taskEstimate').value = '';
    document.getElementById('taskModal').classList.add('active');
}

// ===== EDIT EXISTING TASK =====
function editTask(taskId) {
    editingTaskId = taskId;
    
    // Find task in all columns
    let task = null;
    for (let col of Object.values(boards)) {
        task = col.find(t => t.id === taskId);
        if (task) break;
    }
    
    if (!task) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Task';
    document.getElementById('taskText').value = task.text;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDueDate').value = task.dueDate || '';
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskTags').value = (task.tags || []).join(', ');
    document.getElementById('taskEstimate').value = task.estimate || '';
    document.getElementById('taskModal').classList.add('active');
}

// ===== SAVE TASK (CREATE OR EDIT) =====
function saveTask(event) {
    event.preventDefault();
    
    const taskText = document.getElementById('taskText').value.trim();
    if (!taskText) {
        showToast('Task text is required!', 'error');
        return;
    }
    
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const description = document.getElementById('taskDescription').value;
    const tagsInput = document.getElementById('taskTags').value;
    const estimate = parseFloat(document.getElementById('taskEstimate').value) || 0;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
    
    if (editingTaskId) {
        // Edit existing task
        for (let col of Object.values(boards)) {
            const task = col.find(t => t.id === editingTaskId);
            if (task) {
                task.text = taskText;
                task.priority = priority;
                task.dueDate = dueDate;
                task.description = description;
                task.tags = tags;
                task.estimate = estimate;
                break;
            }
        }
        showToast('Task updated');
    } else {
        // Create new task
        const newTask = {
            id: nextId++,
            text: taskText,
            priority: priority,
            status: currentColumn,
            dueDate: dueDate,
            description: description,
            tags: tags,
            estimate: estimate
        };
        
        boards[currentColumn].push(newTask);
        showToast('Task created');
    }
    
    closeTaskModal();
    saveToHistory();
    renderBoard();
    updateStats();
    saveToLocalStorage();
}

// ===== DELETE TASK =====
function deleteTask(taskId) {
    if (confirm('Delete this task?')) {
        ['todo', 'doing', 'done'].forEach(columnId => {
            boards[columnId] = boards[columnId].filter(task => task.id !== taskId);
        });
        
        saveToHistory();
        renderBoard();
        updateStats();
        saveToLocalStorage();
        showToast('Task deleted');
    }
}

// ===== UNDO/REDO SYSTEM =====
function saveToHistory() {
    // Remove any history after current index
    history = history.slice(0, historyIndex + 1);
    
    // Save current state
    history.push(JSON.parse(JSON.stringify(boards)));
    historyIndex++;
    
    // Limit history to 20 states
    if (history.length > 20) {
        history.shift();
        historyIndex--;
    }
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        boards = JSON.parse(JSON.stringify(history[historyIndex]));
        renderBoard();
        updateStats();
        saveToLocalStorage();
        showToast('Undo');
    }
}

function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        boards = JSON.parse(JSON.stringify(history[historyIndex]));
        renderBoard();
        updateStats();
        saveToLocalStorage();
        showToast('Redo');
    }
}

// ===== DARK MODE TOGGLE =====
function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyDarkMode();
}

function applyDarkMode() {
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// ===== STATISTICS & ANALYTICS =====
function updateStats() {
    const allTasks = Object.values(boards).flat();
    const completedTasks = boards.done.length;
    const inProgressTasks = boards.doing.length;
    const totalTasks = allTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update stat cards
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('inProgressTasks').textContent = inProgressTasks;
    document.getElementById('completionRate').textContent = completionRate + '%';
    
    // Update priority distribution
    const highCount = allTasks.filter(t => t.priority === 'high').length;
    const mediumCount = allTasks.filter(t => t.priority === 'medium').length;
    const lowCount = allTasks.filter(t => t.priority === 'low').length;
    
    document.getElementById('highLabel').textContent = highCount;
    document.getElementById('mediumLabel').textContent = mediumCount;
    document.getElementById('lowLabel').textContent = lowCount;
    
    // Update priority bar widths
    const total = highCount + mediumCount + lowCount;
    if (total > 0) {
        document.getElementById('highCount').style.flex = highCount;
        document.getElementById('mediumCount').style.flex = mediumCount;
        document.getElementById('lowCount').style.flex = lowCount;
    }
}

function showStats() {
    const panel = document.getElementById('statsPanel');
    if (!panel) return;
    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
    } else {
        updateStats();
        panel.classList.add('active');
    }
}

function hideStats() {
    document.getElementById('statsPanel').classList.remove('active');
}

// ===== HELP MODAL =====
function showHelp() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    } else {
        modal.classList.add('active');
    }
}

function hideHelp() {
    document.getElementById('helpModal').classList.remove('active');
}

// ===== MODAL CONTROL =====
function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
    editingTaskId = null;
}

// ===== CLEAR ALL TASKS =====
function clearAll() {
    if (confirm('Delete all tasks?')) {
        boards = { todo: [], doing: [], done: [] };
        nextId = 1;
        saveToHistory();
        renderBoard();
        updateStats();
        saveToLocalStorage();
        showToast('All tasks cleared');
    }
}

// ===== EXPORT TO FILE =====
function exportToFile() {
    const data = {
        boards: boards,
        exportDate: new Date().toLocaleString(),
        version: '1.0'
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Exported tasks');
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast active ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== LOCAL STORAGE =====
function saveToLocalStorage() {
    localStorage.setItem('kanbanBoard', JSON.stringify(boards));
    localStorage.setItem('nextId', nextId);
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('kanbanBoard');
    if (saved) {
        boards = JSON.parse(saved);
        const savedNextId = localStorage.getItem('nextId');
        if (savedNextId) nextId = parseInt(savedNextId);
    }
}

// Prevent drag on buttons
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
    }
});
