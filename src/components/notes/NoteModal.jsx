import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/button';

const NoteModal = ({ 
  show,
  onClose, 
  onSave, 
  noteTitle, 
  setNoteTitle, 
  noteContent, 
  setNoteContent,
  editingNote,
  viewOnly = false,
  viewMeta = null,
  maxLength = 350
}) => {
  if (!show) return null;

  const remainingChars = maxLength - noteTitle.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 transform transition-all duration-300 scale-100 animate-fadeIn">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {viewOnly ? (viewMeta?.index ? `Note ${viewMeta.index}` : 'View Note') : (editingNote ? 'Edit Note' : 'Add Note')}
          </h3>
          <Button 
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={<X className="w-6 h-6" />}
          />
        </div>
        
        {viewOnly ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{noteTitle}</h4>
              <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-[40vh] overflow-auto">{noteContent}</div>
            </div>
            {viewMeta && (
              <div className="text-xs text-gray-400">
                {viewMeta.createdAt} | Created by: {viewMeta.sales}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Title
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => {
                  if (e.target.value.length <= maxLength) {
                    setNoteTitle(e.target.value);
                  }
                }}
                placeholder="Enter note title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <div className={`text-xs mt-1 ${remainingChars < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                Remaining characters: {remainingChars} / {maxLength}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Content
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter note content..."
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
          >
            {viewOnly ? 'Close' : 'Cancel'}
          </Button>
          {!viewOnly && (
            <Button
              onClick={onSave}
              disabled={!noteTitle.trim() || !noteContent.trim()}
              variant="default"
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteModal;