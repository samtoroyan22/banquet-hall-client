"use client";

import { useState } from "react";
import type { IClientDetail } from "@/types/clients.types";
import { PhysicalClientEditForm } from "./PhysicalClientEditForm";
import { LegalClientEditForm } from "./LegalClientEditForm";
import { useClientForms } from "@/hooks/useClientForms";
import { useClientUpdate } from "@/hooks/useClientUpdate";

interface Props {
  client: IClientDetail;
  refreshClient: () => void;
}

export default function ClientMainInfo({ client, refreshClient }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const { physicalForm, legalForm, handlePhoneChange, handleSerialChange, handleNumberChange } =
    useClientForms(client);
  const { onSubmitPhysical, onSubmitLegal } = useClientUpdate({
    client,
    refreshClient,
    setEditMode,
    setLoading,
  });

  const handleCancel = () => {
    if (client.type === "physical") physicalForm.reset();
    else legalForm.reset();
    setEditMode(false);
  };

  return (
    <>
      {client.type === "physical" && (
        <PhysicalClientEditForm
          form={physicalForm}
          editMode={editMode}
          loading={loading}
          onSubmit={onSubmitPhysical}
          onCancel={handleCancel}
          onEdit={() => setEditMode(true)}
          onPhoneChange={(e) => handlePhoneChange(e, "physical")}
          onSerialChange={(e) => handleSerialChange(e)}
          onNumberChange={(e) => handleNumberChange(e)}
        />
      )}
      {client.type === "legal" && (
        <LegalClientEditForm
          form={legalForm}
          editMode={editMode}
          loading={loading}
          onSubmit={onSubmitLegal}
          onCancel={handleCancel}
          onEdit={() => setEditMode(true)}
          onPhoneChange={(e) => handlePhoneChange(e, "legal")}
        />
      )}
    </>
  );
}
