import { useState } from 'react';
import { logActivity } from '../components/utils/activityLogger';
import { useCustomers } from './useCustomers';
import { useAuth } from './useAuth';
import { addNote, editNote, deleteNote } from '../api/api';

export const useNoteManager = () => {
  const { refreshCustomers } = useCustomers();
  const { user, token } = useAuth();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [viewingNoteIndex, setViewingNoteIndex] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleAddNote = (customer) => {
    setSelectedCustomer(customer);
    setShowNoteModal(true);
    setNoteTitle('');
    setNoteContent('');
    setEditingNote(null);
  };

  const handleEditNote = (customer, note) => {
    setSelectedCustomer(customer);
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.body);
    setShowNoteModal(true);
  };

  const handleViewNote = (customer, note, index = null) => {
    setSelectedCustomer(customer);
    setViewingNote(note);
    setViewingNoteIndex(index);
    setShowViewModal(true);
  };

  const handleDeleteNote = async (customerId, noteId) => {
    await deleteNote(token, noteId);
    logActivity('note_deleted', { customerId, noteId });
    refreshCustomers();
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim() || !selectedCustomer) return;

    const newNote = {
      title: noteTitle,
      body: noteContent,
      createdAt: new Date().toISOString(),
      customerId: selectedCustomer.id,
      sales: user,
    };

    if (editingNote) {
      await editNote(token, editingNote.id, newNote);
    } else {
      await addNote(token, newNote);
    }

    logActivity(editingNote ? 'note_edited' : 'note_added', { 
      customerId: selectedCustomer.id, 
      note: newNote 
    });

    setShowNoteModal(false);
    setNoteTitle('');
    setNoteContent('');
    setEditingNote(null);
    refreshCustomers();
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setNoteTitle('');
    setNoteContent('');
    setEditingNote(null);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingNote(null);
    setViewingNoteIndex(null);
  };

  return {
    showNoteModal,
    noteTitle,
    setNoteTitle,
    noteContent,
    setNoteContent,
    editingNote,
    selectedCustomer,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleSaveNote,
    closeNoteModal,
    viewingNote,
    viewingNoteIndex,
    showViewModal,
    handleViewNote,
    closeViewModal
  };
};