import React, { useState } from 'react';
import SearchBar from './SearchBar';
import FilterButton from '../filter/FilterButton';
import FilterPanel from '../filter/FilterPanel';
import Pagination from './Pagination';
import TablePromotion from './TablePromotion';
import NoteModal from '../notes/NoteModal';
import ExpandedRowContent from './ExpandedRowContent';

import { useCustomers } from '../../hooks/useCustomers';
import { useNoteManager } from '../../hooks/useNoteManager';
import { logActivity } from '../utils/activityLogger';

const CustomerTableContainer = () => {
  const {
    customers,
    page,
    pageSize,
    totalPages,
    totalItems,
    setPage,
    setPageSize,
    setFilters,
    setSearch
  } = useCustomers();

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState({
    rank: null,
    probabilityRanges: [],
    categories: [],
    ageRanges: [],
    balanceSort: null,
    hasDeposit: null,
    hasLoan: null
  });

  const noteManager = useNoteManager();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearch(value);
    setPage(1);
  };

  const handleApplyFilters = (newFilters) => {
    const defaultShape = {
      rank: null,
      probabilityRanges: [],
      categories: [],
      ageRanges: [],
      balanceSort: null,
      hasDeposit: null,
      hasLoan: null
    };

    setFilterState(newFilters);
    setFilters(newFilters); // server-side filtering
    setPage(1);

    const isReset =
      JSON.stringify(newFilters) === JSON.stringify(defaultShape);

    logActivity(isReset ? 'filter_reset' : 'filter_applied', {
      filters: newFilters
    });

    setShowFilterPanel(false);
  };

  const toggleRow = (customerId) => {
    const next = expandedRow === customerId ? null : customerId;
    setExpandedRow(next);
    logActivity('row_toggled', {
      customerId,
      open: next !== null
    });
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by customer name or ID..."
          />
        </div>
        <FilterButton
          onClick={() => {
            setShowFilterPanel(true);
            logActivity('filter_open', {});
          }}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-visible">
        <TablePromotion
          data={customers}
          onAddNote={noteManager.handleAddNote}
          onView={(customer) => toggleRow(customer.id)}
          expandedRow={expandedRow}
          renderExpanded={(row) => (
            <ExpandedRowContent
              customer={row}
              onAddNote={noteManager.handleAddNote}
              onEditNote={noteManager.handleEditNote}
              onDeleteNote={noteManager.handleDeleteNote}
              onViewNote={noteManager.handleViewNote}
            />
          )}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          itemsPerPage={pageSize}
          itemsPerPageOptions={[10,20,30,40,50,60,70,80,90,100]}
          totalItems={totalItems}
          startIndex={(page - 1) * pageSize}
          endIndex={page * pageSize}
          onPageChange={setPage}
          onItemsPerPageChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        />
      </div>

      <FilterPanel
        show={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filterState}
        onApply={handleApplyFilters}
      />

      {/* Note modals */}
      <NoteModal
        show={noteManager.showNoteModal}
        onClose={noteManager.closeNoteModal}
        onSave={noteManager.handleSaveNote}
        noteTitle={noteManager.noteTitle}
        setNoteTitle={noteManager.setNoteTitle}
        noteContent={noteManager.noteContent}
        setNoteContent={noteManager.setNoteContent}
        editingNote={noteManager.editingNote}
        maxLength={350}
      />

      <NoteModal
        show={noteManager.showViewModal}
        onClose={noteManager.closeViewModal}
        viewOnly={true}
        noteTitle={noteManager.viewingNote?.title ?? ''}
        noteContent={
          (noteManager.viewingNote?.body ??
            noteManager.viewingNote?.content) ??
          ''
        }
        viewMeta={
          noteManager.viewingNote
            ? {
                createdAt: noteManager.viewingNote.createdAt,
                sales: noteManager.viewingNote.sales,
                index:
                  noteManager.viewingNoteIndex != null
                    ? noteManager.viewingNoteIndex + 1
                    : null
              }
            : null
        }
      />
    </div>
  );
};

export default CustomerTableContainer;
