"use client";

import { format } from "date-fns";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { IKeyDate } from "@/types/clients.types";
import { useState } from "react";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { Trash2 } from "lucide-react";

interface Props {
  dateItem: IKeyDate;
  refreshClient: () => Promise<void>;
}

export default function KeyDateCard({ dateItem, refreshClient }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await apiFetch("/client/delete-key-date", {
        method: "POST",
        body: JSON.stringify({ keyDateId: dateItem.id }),
      });
      toast.success("Дата удалена");
      await refreshClient();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при удалении даты");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-primary/70 hover:bg-primary/5 relative flex h-auto w-64 flex-col items-center justify-center rounded-xl border-2 px-3 py-3 text-center transition">
      <button
        disabled={loading}
        onClick={() => setDeleteDialogOpen(true)}
        className="absolute top-2 right-2 cursor-pointer text-red-500"
      >
        <Trash2 size={18} />
      </button>

      <ConfirmDeleteModal
        title="Вы хотите удалить эту дату?"
        onConfirm={handleDelete}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />

      <span className="text-primary-dark text-lg font-bold">
        {format(new Date(dateItem.date), "dd.MM.yyyy")}
      </span>
      <span className="text-primary-dark text-md mt-1 line-clamp-2 break-words">
        {dateItem.description}
      </span>
    </div>
  );
}
