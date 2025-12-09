import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../ui/button';

const NoteList = ({ notes, onEdit, onDelete, onView }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4 italic">
        No notes available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note, idx) => (
        <div 
          key={`${note.customerId}-${note.id}`}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow text-left cursor-pointer relative"
          onClick={() => onView && onView(note, idx)}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-800">{String(note.title || '').trim()}</h4>
            <div className="flex space-x">
              <Button
                onClick={(e) => { e.stopPropagation(); onEdit(note); }}
                variant="ghost"
                size="xs"
                icon={<Edit className="w-4 h-4" />}
                title="Edit Note"
              />
              <Button
                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                variant="ghost"
                size="xs"
                icon={<Trash2 className="w-4 h-4" />}
                className="text-red-600 hover:text-red-800"
                title="Delete Note"
              />
            </div>
          </div>
          <div className="relative">
            <p className="text-sm text-gray-600 mb-2 mt-0 text-left whitespace-pre-wrap w-full ml-0 pl-0 max-h-20 overflow-hidden">{String(note.body ?? note.content ?? '').trim()}</p>
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-6 bg-gradient-to-t from-white/90 to-transparent"></div>
          </div>
          <div className="text-xs text-gray-400">
            {note.createdAt} | Created by: {note.sales}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;