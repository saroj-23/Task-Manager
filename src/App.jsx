import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Plus, Search, ListTodo, CheckCircle2, Clock3 } from 'lucide-react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

const STORAGE_KEY = 'aqualion-mini-task-manager-tasks';

function readSavedTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState(readSavedTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'PENDING').length,
    completed: tasks.filter((task) => task.status === 'COMPLETED').length,
  }), [tasks]);

  const visibleTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };

    return tasks
      .filter((task) => statusFilter === 'ALL' || task.status === statusFilter)
      .filter((task) => priorityFilter === 'ALL' || task.priority === priorityFilter)
      .filter((task) => !normalizedSearch
        || task.title.toLowerCase().includes(normalizedSearch)
        || task.description.toLowerCase().includes(normalizedSearch))
      .sort((a, b) => sortBy === 'PRIORITY'
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : b.createdAt - a.createdAt);
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  function saveTask(taskData) {
    if (editingTask) {
      setTasks((current) => current.map((task) => task.id === editingTask.id
        ? { ...task, ...taskData, updatedAt: Date.now() }
        : task));
    } else {
      const id = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
      setTasks((current) => [{
        id,
        ...taskData,
        status: 'PENDING',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }, ...current]);
    }
    setEditingTask(null);
    setIsFormOpen(false);
  }

  function startEditing(task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingTask(null);
    setIsFormOpen(false);
  }

  function toggleComplete(taskId) {
    setTasks((current) => current.map((task) => task.id === taskId
      ? { ...task, status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING', updatedAt: Date.now() }
      : task));
  }

  function deleteTask(taskId) {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Mini Task Manager home">
          <span className="brand-icon"><ClipboardList size={21} /></span>
          <span>Task<span className="brand-light">Flow</span></span>
        </a>
        <span className="topbar-note">Aqualion Digital · Technical Exercise</span>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h1>My Tasks</h1>
          <p className="subheading">Organise your work, one task at a time.</p>
        </div>
        <button className="primary-button" onClick={() => { setEditingTask(null); setIsFormOpen(true); }}>
          <Plus size={18} /> Add task
        </button>
      </section>

      <section className="stats-grid" aria-label="Task summary">
        <div className="stat-card">
          <span className="stat-icon purple"><ListTodo size={19} /></span>
          <div><span className="stat-label">Total tasks</span><strong>{counts.total}</strong></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon orange"><Clock3 size={19} /></span>
          <div><span className="stat-label">Pending</span><strong>{counts.pending}</strong></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon green"><CheckCircle2 size={19} /></span>
          <div><span className="stat-label">Completed</span><strong>{counts.completed}</strong></div>
        </div>
      </section>

      <section className="tasks-panel">
        <div className="panel-heading">
          <div>
            <h2>All tasks</h2>
            <p>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} shown</p>
          </div>
        </div>

        <div className="toolbar">
          <label className="search-box">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search tasks"
            />
          </label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority">
            <option value="ALL">All priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort tasks">
            <option value="NEWEST">Newest first</option>
            <option value="PRIORITY">Priority</option>
          </select>
        </div>

        <TaskList
          tasks={visibleTasks}
          onEdit={startEditing}
          onToggleComplete={toggleComplete}
          onDelete={deleteTask}
          hasAnyTasks={tasks.length > 0}
          onAddTask={() => setIsFormOpen(true)}
        />
      </section>

      <footer className="footer">Built with React · Tasks are saved in this browser</footer>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSave={saveTask}
          onClose={closeForm}
        />
      )}
    </main>
  );
}

