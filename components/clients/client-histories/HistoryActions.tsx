"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, SquarePen, Trash2 } from "lucide-react";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

export function HistoryActions({ onEdit, onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer outline-0">
          <Ellipsis className="text-muted-foreground" size={20} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex cursor-pointer items-center" onClick={onEdit}>
          <SquarePen className="text-chart-5 mr-2 h-4 w-4" />
          <span>Редактировать</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex cursor-pointer items-center" onClick={onDelete}>
          <Trash2 className="text-destructive mr-2 h-4 w-4" />
          <span>Удалить</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
