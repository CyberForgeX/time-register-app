import { useState } from 'react';
import { TimeEntry } from '../types/TimeEntry';
import ErrorList from '../ErrorList/ErrorList';
import styles from './TimeEntryForm.module.css';

type FormError = {
  field: string;
  message: string;
};

type TimeEntryFormProps = {
  timeEntries: TimeEntry[];
  onAddTimeEntry: (entry: TimeEntry) => void;
  onDeleteTimeEntry: (id: number) => void;
};

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  timeEntries,
  onAddTimeEntry,
  onDeleteTimeEntry,
}) => {
  const [hours, setHours] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [formErrors, setFormErrors] = useState<FormError[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now(),
      hours,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAddTimeEntry(newEntry);
    setHours(0);
    setComment('');
    setFormErrors([]);
  };

  const validateForm = (): FormError[] => {
    const errors: FormError[] = [];

    if (hours <= 0 || hours > 24) {
      errors.push({ field: 'hours', message: 'Hours must be between 1 and 24.' });
    }

    if (comment.trim().length === 0) {
      errors.push({ field: 'comment', message: 'Comment is required.' });
    }

    return errors;
  };

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHours(parseInt(event.target.value));
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleDeleteTimeEntry = (id: number) => {
    onDeleteTimeEntry(id);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formInputs}>
      <div className={styles.formGroup}>
        <label htmlFor="hours" className={styles.formLabel}>
          Hours:
        </label>
        <input
          type="number"
          id="hours"
          name="hours"
          className={styles.formControl}
          required
          value={hours}
          onChange={handleHoursChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="comment" className={styles.formLabel}>
          Comment:
        </label>
        <textarea
          id="comment"
          name="comment"
          className={styles.formControl}
          required
          value={comment}
          onChange={handleCommentChange}
        ></textarea>
      </div>
      {formErrors.length > 0 && (
        <div className={styles.errorList}>
          {formErrors.map((error, index) => (
            <p key={index} className={styles.errorItem}>
              {error.message}
            </p>
          ))}
        </div>
      )}
      <button type="submit" className={styles.btnSubmit}>
        Save
      </button>
      <ul>
        {timeEntries.map((entry) => (
          <li key={entry.id}>
            {entry.hours} hours - {entry.comment}
<button
  onClick={() => {
    handleDeleteTimeEntry(entry.id);
  }}
  className={styles.btnDelete}
>
  Delete
</button>
</li>
))}
</ul>

  </form>
);
};
export default TimeEntryForm;