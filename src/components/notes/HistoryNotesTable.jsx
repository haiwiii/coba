import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNoteManager } from '../../hooks/useNoteManager';
import NoteModal from './NoteModal';
import { getNotes } from '../../api/api';
import Pagination from '../common/Pagination';

const truncate = (text, len = 120) => {
  if (!text) return '';
  return text.length > len ? text.slice(0, len).trim() + '...' : text;
};

const HistoryNotesTable = ({ initialPageSize = 10 }) => {
  const noteManager = useNoteManager();
  const { token } = useAuth();
  const [allNotes, setAllNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!token) return;
    setNotesLoading(true);
    try {
      const { error, notes } = await getNotes(token);
      if (!error) setAllNotes(notes || []);
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setNotesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' = oldest first, 'desc' = newest first

  const sortedNotes = useMemo(() => {
    const arr = Array.isArray(allNotes) ? [...allNotes] : [];
    arr.sort((a, b) => {
      const ta = a?.createdAt ? Date.parse(a.createdAt) : 0;
      const tb = b?.createdAt ? Date.parse(b.createdAt) : 0;
      return sortOrder === 'asc' ? ta - tb : tb - ta;
    });
    return arr;
  }, [allNotes, sortOrder]);

  const totalItems = sortedNotes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const visibleNotes = sortedNotes.slice((page - 1) * pageSize, page * pageSize);

  const handleView = (note, idx) => {
    const customer = note.customerId ? { id: note.customerId, name: note.customerName } : null;
    noteManager.handleViewNote(customer, note, idx);
  };

  useEffect(() => {
    // reset to first page when pageSize or sort changes
    setPage(1);
  }, [pageSize, sortOrder]);

  return (
    <div className="mt-12">
      <div className="rounded-xl overflow-hidden shadow-md">
        <div className="bg-gray-900 text-white p-6">
          <div className="overflow-x-auto mt-2">
            <div className="min-w-full flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Your Campaign History (by Notes)</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadNotes}
                  disabled={notesLoading}
                  className="px-3 py-2 bg-gray-700 text-white rounded text-sm disabled:opacity-50"
                  aria-label="Refresh history notes"
                  title="Refresh"
                >
                  {notesLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-300 text-xs uppercase">
                  <th className="px-4 py-2 w-28">Cust.ID</th>
                  <th className="px-4 py-2">Cust. Name</th>
                  <th className="px-4 py-2 w-40">
                    <div className="flex items-center gap-2">
                      <span>Date Created</span>
                      <button
                        onClick={() => setSortOrder((s) => (s === 'desc' ? 'asc' : 'desc'))}
                        className={`ml-1 p-1 rounded focus:outline-none ${sortOrder === 'desc' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        aria-label={sortOrder === 'desc' ? 'Sort by newest' : 'Sort by oldest'}
                        title={sortOrder === 'desc' ? 'Sort by newest' : 'Sort by oldest'}
                      >
                        {sortOrder === 'desc' ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="px-4 py-2">Note</th>
                  <th className="px-4 py-2 w-28">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleNotes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">No history notes available</td>
                  </tr>
                ) : (
                  visibleNotes.map((note, idx) => (
                    <tr key={`${note.customerId}-${note.id}`} className="border-t border-gray-800 hover:bg-gray-800">
                      <td className="px-4 py-3 align-top text-gray-200">{note.customerId}</td>
                      <td className="px-4 py-3 align-top text-gray-100">{note.customerName}</td>
                      <td className="px-4 py-3 align-top text-gray-300">{note.createdAt}</td>
                      <td className="px-4 py-3 align-top text-gray-200">
                        <div className="max-h-16 overflow-hidden text-sm text-gray-200 whitespace-pre-wrap">
                          {truncate(note.body ?? note.content ?? '', 140)}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          onClick={() => handleView(note, (page - 1) * pageSize + idx)}
                          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 rounded"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="mt-3">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              itemsPerPage={pageSize}
              itemsPerPageOptions={[5,10,20,50]}
              totalItems={totalItems}
              startIndex={(page - 1) * pageSize + 1}
              endIndex={Math.min(page * pageSize, totalItems)}
              onPageChange={(p) => setPage(p)}
              onItemsPerPageChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              dark={true}
            />
          </div>
        </div>
      </div>

      {/* Reuse NoteModal for viewing note content (viewOnly) */}
      <NoteModal
        show={noteManager.showViewModal}
        onClose={noteManager.closeViewModal}
        viewOnly={true}
        noteTitle={noteManager.viewingNote?.title ?? ''}
        noteContent={(noteManager.viewingNote?.body ?? noteManager.viewingNote?.content) ?? ''}
        viewMeta={noteManager.viewingNote ? { createdAt: noteManager.viewingNote.createdAt, sales: noteManager.viewingNote.sales } : null}
      />
    </div>
  );
};

export default HistoryNotesTable;
