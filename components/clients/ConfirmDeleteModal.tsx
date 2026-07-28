"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface Props {
  onConfirm: () => Promise<void> | void;
  open: boolean;
  setOpen: (value: boolean) => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDeleteModal({
  onConfirm,
  open,
  setOpen,
  title = "Вы уверены, что хотите удалить?",
  confirmText = "Да",
  cancelText = "Нет",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xs rounded-2xl p-6 backdrop-blur-md">
        <DialogHeader className="pb-4 text-center">
          <DialogTitle className="text-primary-dark text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-2 text-base"
          >
            {confirmText}
          </Button>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-primary w-full py-2 text-base"
          >
            {cancelText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
