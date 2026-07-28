"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LegalClientForm from "./LegalClientForm";
import PhysicalClientForm from "./PhysicalClientForm";

interface Props {
  refreshClients: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddClientDialog({ refreshClients, open, setOpen }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="text-md cursor-pointer font-medium shadow-md transition-all duration-200 hover:shadow-lg"
        >
          Добавить клиента
        </Button>
      </DialogTrigger>

      <DialogContent className="animate-in fade-in-0 zoom-in-95 fade-out-0 zoom-out-95 border-background/80 bg-background max-w-lg rounded-2xl border p-6 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out">
        <DialogHeader className="border-primary flex justify-between border-b pb-4">
          <DialogTitle className="text-primary-dark text-xl font-semibold">
            Создание клиента
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="physical" className="mt-4 w-full">
          <TabsList className="bg-muted grid w-full grid-cols-2 rounded-xl p-1">
            <TabsTrigger
              value="physical"
              className="text-primary-dark data-[state=active]:bg-background cursor-pointer rounded-lg transition-all data-[state=active]:shadow-sm"
            >
              Физ. лицо
            </TabsTrigger>
            <TabsTrigger
              value="legal"
              className="data-[state=active]:bg-background text-primary-dark cursor-pointer rounded-lg transition-all data-[state=active]:shadow-sm"
            >
              Юр. лицо
            </TabsTrigger>
          </TabsList>

          <TabsContent value="physical" className="mt-6">
            <PhysicalClientForm setOpen={(v) => setOpen(!!v)} onCreated={refreshClients} />
          </TabsContent>

          <TabsContent value="legal" className="mt-6">
            <LegalClientForm setOpen={(v) => setOpen(!!v)} onCreated={refreshClients} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
