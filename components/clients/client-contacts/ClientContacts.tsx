"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { IClientContact } from "@/types/clients.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { ContactRow } from "./ContactRow";
import AddContactModal from "./AddContactModla";

interface Props {
  contacts: IClientContact[] | null;
  clientId: string;
  refreshClient: () => Promise<void>;
}

export function ClientContacts({ contacts, clientId, refreshClient }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  async function handleDelete(contactId: string) {
    try {
      await apiFetch("/client/delete-contact", {
        method: "POST",
        body: JSON.stringify({ contactId }),
      });
      toast.success("Контакт успешно удалён!");
      await refreshClient();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка при удалении контакта");
    }
  }

  const sortedContacts = useMemo(() => {
    if (!contacts) return [];
    return [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">ФИО</TableHead>
            <TableHead className="w-[20%]">Телефон</TableHead>
            <TableHead className="w-[20%]">Должность</TableHead>
            <TableHead className="w-[25%]">Email</TableHead>
            <TableHead className="w-[1%]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedContacts.length ? (
            sortedContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                setDeleteDialogOpen={setDeleteDialogOpen}
                setSelectedContactId={setSelectedContactId}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground text-center">
                Контактов пока нет
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell colSpan={5}>
              <AddContactModal clientId={clientId} onCreated={refreshClient} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {selectedContactId && (
        <ConfirmDeleteModal
          title="Вы хотите удалить этот контакт?"
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          onConfirm={async () => {
            await handleDelete(selectedContactId);
            setSelectedContactId(null);
          }}
        />
      )}
    </>
  );
}
