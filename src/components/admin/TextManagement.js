import React, { useState, useEffect } from 'react';
import { getTextBlocks, updateTextBlock, deleteTextBlock } from '../../utils/textManager';
import './TextManagement.css';

function TextManagement({ editorName, setEditorName }) {
  const [textBlocks, setTextBlocks] = useState([]);
  const [filter, setFilter] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [showChanges, setShowChanges] = useState(false);

  useEffect(() => {
    loadTextBlocks();
  }, []);

  const loadTextBlocks = async () => {
    setLoading(true);
    try {
      const blocks = await getTextBlocks();
      setTextBlocks(blocks);
    } catch (error) {
      console.error('Failed to load text blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key, currentValue) => {
    if (!editorName.trim()) {
      alert('Please enter your editor name before making changes.');
      return;
    }
    setEditingKey(key);
    setEditValue(currentValue);
  };

  const handleSave = async (key) => {
    try {
      await updateTextBlock(key, editValue, editorName);
      setTextBlocks(prev => 
        prev.map(block => 
          block.key === key 
            ? { ...block, english: editValue, editorName, editHistory: 'Modified' }
            : block
        )
      );
      setEditingKey(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to update text block:', error);
      alert('Failed to update text block. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const handleDelete = async (key) => {
    if (!window.confirm('Are you sure you want to delete this text block?')) {
      return;
    }

    try {
      await deleteTextBlock(key);
      setTextBlocks(prev => prev.filter(block => block.key !== key));
    } catch (error) {
      console.error('Failed to delete text block:', error);
      alert('Failed to delete text block. Please try again.');
    }
  };

  const filteredBlocks = textBlocks.filter(block =>
    block.key.toLowerCase().includes(filter.toLowerCase()) ||
    block.english.toLowerCase().includes(filter.toLowerCase())
  );

  const exportQuestions = () => {
    const csvContent = [
      ['Key', 'English', 'Site Mode', 'Edit History', 'Editor Name'],
      ...filteredBlocks.map(block => [
        block.key,
        block.english,
        block.siteMode,
        block.editHistory,
        block.editorName || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-text-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading">Loading text blocks...</div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <h3>Text management</h3>
      
      <div className="admin-description">
        <p>
          The table shows all text within the Comprehensive calculator that is available to edit by administrators. 
          You can view and edit the text when viewing the Comprehensive calculator. Select 'Edit text - form view' 
          form to manage text while viewing the Comprehensive calculator. You can also view the questions and 
          associated XML in a spreadsheet. To create a spreadsheet showing the text for today's date please export questions.
        </p>
        <button className="admin-link">See which companies have used this feature</button>
      </div>

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="filter">Filter:</label>
            <input
              type="text"
              id="filter"
              className="form-control"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search text blocks..."
            />
          </div>
          <div className="filter-group">
            <label htmlFor="editorName">Editor name*:</label>
            <input
              type="text"
              id="editorName"
              className="form-control"
              value={editorName}
              onChange={(e) => setEditorName(e.target.value)}
              placeholder="In order to edit translations please enter your name"
            />
          </div>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => setShowChanges(!showChanges)}
          >
            Show changes
          </button>
        </div>
      </div>

      <div className="text-blocks-table">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>English</th>
              <th>Site mode</th>
              <th>Edit history</th>
              <th>Editor name</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlocks.map(block => (
              <tr key={block.key}>
                <td>
                  <button 
                    className="text-link"
                    onClick={() => handleEdit(block.key, block.english)}
                  >
                    {block.key}
                  </button>
                </td>
                <td>
                  {editingKey === block.key ? (
                    <div className="edit-cell">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="edit-textarea"
                      />
                      <div className="edit-actions">
                        <button 
                          type="button" 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSave(block.key)}
                        >
                          Save
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    block.english
                  )}
                </td>
                <td>{block.siteMode}</td>
                <td>{block.editHistory}</td>
                <td>{block.editorName || ''}</td>
                <td>
                  <button 
                    className="text-link delete-link"
                    onClick={() => handleDelete(block.key)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="export-section">
        <button 
          type="button" 
          className="btn btn-outline"
          onClick={exportQuestions}
        >
          Export questions
        </button>
      </div>
    </div>
  );
}

export default TextManagement;
