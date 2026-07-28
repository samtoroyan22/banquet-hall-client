"use client";

import type { IHistory } from "@/types/clients.types";
import { TableRow, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HistoryActions } from "./HistoryActions";
import { Check, X } from "lucide-react";

interface Props {
  history: IHistory;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedHistoryId: (id: string | null) => void;
  refreshClient: () => Promise<void>;
}

export function HistoryRow({
  history,
  setDeleteDialogOpen,
  setSelectedHistoryId,
  refreshClient,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(history.description || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await apiFetch("/history/edit", {
        method: "POST",
        body: JSON.stringify({
          historyId: history.id,
          updateData: { description },
        }),
      });
      toast.success("Описание обновлено!");
      setEditing(false);
      await refreshClient();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  }

  return (
    <TableRow>
      <TableCell>{format(new Date(history.date), "dd.MM.yyyy HH:mm")}</TableCell>
      <TableCell>{history.type_history?.name}</TableCell>
      <TableCell>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border p-1"
            />
            <Button size="icon" variant="ghost" onClick={handleSave} disabled={saving}>
              <Check size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setDescription(history.description || "");
              }}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          history.description || "—"
        )}
      </TableCell>
      <TableCell className="h-20 text-right">
        <HistoryActions
          onEdit={() => setEditing(true)}
          onDelete={() => {
            setSelectedHistoryId(history.id);
            setDeleteDialogOpen(true);
          }}
        />
      </TableCell>
    </TableRow>
  );
}
