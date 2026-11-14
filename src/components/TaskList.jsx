import { ClipboardList, Plus } from 'lucide-react';
import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, onEdit, onToggleComplete, onDelete, hasAnyTasks, onAddTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><ClipboardList size={27} /></span>
        <h3>{hasAnyTasks ? 'No matching tasks' : 'Nothing on your list yet'}</h3>
        <p>{hasAnyTasks
          ? 'Try changing your search or filters.'
          : 'Create your first task and keep your work moving.'}</p>
        {!hasAnyTasks && (
          <button className="primary-button small-button" onClick={onAddTask}>
            <Plus size={16} /> Create your first task
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
