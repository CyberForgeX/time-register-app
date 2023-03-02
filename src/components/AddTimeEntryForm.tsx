import { useState } from 'react';
import { TimeEntry } from '../types/TimeEntry';

type FormError = {
  field: string,
  message: string,
}

type AddTimeEntryFormProps = {
  onAddTimeEntry: (entry: TimeEntry) => void;
}

const AddTimeEntryForm:React.FC = ({ onAddTimeEntry }: AddTimeEntryFormProps) => {
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col mb-4">
        <label htmlFor="hours" className="font-bold">Hours:</label>
        <input type="number" id="hours" name="hours" className="border rounded-lg p-2" required value={hours} onChange={handleHoursChange} />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="comment" className="font-bold">Comment:</label>
        <textarea id="comment" name="comment" className="border rounded-lg p-2" required value={comment} onChange={handleCommentChange}></textarea>
      </div>
      {formErrors.length > 0 && (
        <ErrorList errors={formErrors} />
      )}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Save</button>
    </form>
  );
};

export default AddTimeEntryForm;