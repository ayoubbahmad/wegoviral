"use client";

import { useParams } from "next/navigation";
import { ScriptWizardContainer } from "@/containers/Scripts/ScriptWizard";

export default function EditScriptPage() {
  const params = useParams();
  const id = params.id as string;

  return <ScriptWizardContainer scriptId={id} />;
}
