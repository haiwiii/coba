import { Plus } from "lucide-react";
import DemographyCard from "../demography/DemographyCard";
import NoteList from "../notes/NoteList";
import Button from "../ui/button";

const ExpandedRowContent = ({
  customer,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onViewNote,
  hideNotes = false,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-inner">
      <div className="flex items-start justify-between mb-3 gap-6">
        {/* LOGIKA: Jika hideNotes = false, maka tampilkan Sales Notes. Jika true, hilangkan. */}
        {!hideNotes && (
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Sales Notes</h3>
              <Button
                onClick={() => onAddNote(customer)}
                variant="default"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                Add
              </Button>
            </div>
            <NoteList
              notes={customer.notes || []}
              onEdit={(note) => onEditNote(customer, note)}
              onDelete={(noteId) => onDeleteNote(customer.id, noteId)}
              onView={(note, idx) => onViewNote && onViewNote(customer, note, idx)}
            />
          </div>
        )}

        {/* LOGIKA POSISI: Jika notes hilang, container jadi full width dan rata kanan (justify-end) */}
        <div className={hideNotes ? "w-full flex justify-center" : "w-96"}>
          <div className={hideNotes ? "w-full max-w-[520px]" : "w-96"}>
            <DemographyCard customer={customer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedRowContent;
