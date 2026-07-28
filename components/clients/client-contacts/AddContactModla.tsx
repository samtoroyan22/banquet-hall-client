"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddClientContactForm from "./AddClientContactForm";

interface Props {
  clientId: string;
  onCreated?: () => void;
}

export default function AddClientContactModal({ clientId, onCreated }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="text-primary flex cursor-pointer items-center justify-center gap-2 py-3 hover:underline">
          <Plus className="h-5 w-5" />
          <span>Добавить контакт</span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border p-6 shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-primary-dark text-lg font-semibold">
            Добавить контакт клиента
          </DialogTitle>
        </DialogHeader>

        <AddClientContactForm clientId={clientId} setOpen={setOpen} onCreated={onCreated} />
      </DialogContent>
    </Dialog>
  );
}
