"use client";

import { Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import type { IClientContact } from "@/types/clients.types";
import { cn } from "@/lib/utils";

interface Props {
  contact: IClientContact;
  setDeleteDialogOpen: (open: boolean) => void;
  setSelectedContactId: (id: string) => void;
}

export function ContactRow({ contact, setDeleteDialogOpen, setSelectedContactId }: Props) {
  return (
    <TableRow className={cn("hover:bg-muted/50 cursor-pointer transition-colors duration-150")}>
      <TableCell>{contact.name}</TableCell>
      <TableCell>{contact.phone || "—"}</TableCell>
      <TableCell>{contact.position || "—"}</TableCell>
      <TableCell>{contact.email || "—"}</TableCell>
      <TableCell className="text-right">
        <Trash2
          className="text-destructive h-4 w-4 cursor-pointer"
          onClick={() => {
            setSelectedContactId(contact.id);
            setDeleteDialogOpen(true);
          }}
        />
      </TableCell>
    </TableRow>
  );
}
