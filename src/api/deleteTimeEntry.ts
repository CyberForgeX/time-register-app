export const deleteTimeEntry = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`./time-entries/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete time entry');
    }
  } catch (error) {
    throw new Error(`Failed to delete time entry: ${error.message}`);
  }
};