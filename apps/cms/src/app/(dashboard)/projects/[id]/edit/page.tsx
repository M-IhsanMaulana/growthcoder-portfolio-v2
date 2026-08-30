"use client";

import React, { use } from "react";
import { ProjectForm } from "@/components/projects/project-form";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const resolvedParams = use(params);

  return <ProjectForm initialId={resolvedParams.id} />;
}
