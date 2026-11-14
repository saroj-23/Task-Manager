import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function TaskForm({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState(task?.priority ?? 'MEDIUM');
  const [error, setError] = useState('');

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }
    if (!['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
      setError('Please select a valid priority.');
      return;
    }
    onSave({ title: title.trim(), description: description.trim(), priority });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{task ? 'UPDATE DETAILS' : 'NEW ITEM'}</p>
            <h2 id="task-form-title">{task ? 'Edit task' : 'Create a task'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close form"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="task-title">Task title <span>*</span></label>
          <input
            id="task-title"
            autoFocus
            maxLength={100}
            placeholder="e.g. Prepare project documentation"
            value={title}
            onChange={(event) => { setTitle(event.target.value); setError(''); }}
          />

          <label className="field-label" htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            rows="4"
            maxLength={500}
            placeholder="Add a few details about this task..."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <label className="field-label" htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">{task ? 'Save changes' : 'Create task'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
