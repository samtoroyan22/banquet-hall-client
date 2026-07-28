"use client";

import type { IHistory, ITypeHistory } from "@/types/clients.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useState, useMemo } from "react";
import AddHistoryDialog from "./AddHistoryDialog";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { HistoryRow } from "./HistoryRow";

interface Props {
  histories: IHistory[] | null;
  types: ITypeHistory[];
  clientId: string;
  refreshClient: () => Promise<void>;
}

export function ClientHistory({ histories, types, clientId, refreshClient }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  async function handleDelete(historyId: string) {
    try {
      await apiFetch("/history/delete", {
        method: "POST",
        body: JSON.stringify({ historyId }),
      });
      toast.success("Запись успешно удалена!");
      await refreshClient();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при удалении записи");
    }
  }

  const sortedHistories = useMemo(() => {
    if (!histories) return [];
    return [...histories].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [histories]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Дата и время</TableHead>
            <TableHead className="w-[20%]">Тип</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead className="w-[50px] text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedHistories.length ? (
            sortedHistories.map((history) => (
              <HistoryRow
                key={history.id}
                history={history}
                setDeleteDialogOpen={setDeleteDialogOpen}
                setSelectedHistoryId={setSelectedHistoryId}
                refreshClient={refreshClient}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground text-center">
                История пуста
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell colSpan={4}>
              <AddHistoryDialog clientId={clientId} types={types} refreshClient={refreshClient} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {selectedHistoryId && (
        <ConfirmDeleteModal
          title="Вы хотите удалить эту запись?"
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          onConfirm={async () => {
            await handleDelete(selectedHistoryId);
            setSelectedHistoryId(null);
          }}
        />
      )}
    </>
  );
}
