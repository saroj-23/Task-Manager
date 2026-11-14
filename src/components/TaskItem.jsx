import { Check, Pencil, RotateCcw, Trash2 } from 'lucide-react';

export default function TaskItem({ task, onEdit, onToggleComplete, onDelete }) {
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(task.createdAt));

  return (
    <article className={`task-item ${task.status === 'COMPLETED' ? 'is-completed' : ''}`}>
      <button
        className={`complete-toggle ${task.status === 'COMPLETED' ? 'checked' : ''}`}
        onClick={() => onToggleComplete(task.id)}
        aria-label={task.status === 'COMPLETED' ? 'Reopen task' : 'Mark task completed'}
        title={task.status === 'COMPLETED' ? 'Reopen task' : 'Complete task'}
      >
        {task.status === 'COMPLETED' && <Check size={15} />}
      </button>

      <div className="task-main">
        <div className="task-title-line">
          <h3>{task.title}</h3>
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
          </span>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className={`status-label ${task.status === 'COMPLETED' ? 'status-completed' : 'status-pending'}`}>
            {task.status === 'COMPLETED' ? 'Completed' : 'Pending'}
          </span>
          <span className="meta-dot">·</span>
          <span>Created {dateLabel}</span>
        </div>
      </div>

      <div className="task-actions">
        <button className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit">
          <Pencil size={17} />
        </button>
        <button className="icon-button" onClick={() => onToggleComplete(task.id)} aria-label={task.status === 'COMPLETED' ? 'Reopen' : 'Complete'}>
          {task.status === 'COMPLETED' ? <RotateCcw size={17} /> : <Check size={18} />}
        </button>
        <button className="icon-button danger-hover" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} title="Delete">
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
