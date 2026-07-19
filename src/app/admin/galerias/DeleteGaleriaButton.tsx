"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DeleteGaleriaButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const confirmDelete = async () => {
    setIsModalOpen(false);

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/galerias/single?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        router.refresh();
      } else {
        alert(data.message || "Erro ao apagar");
      }
    } catch (error) {
      alert("Erro de conexão");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
        className="inline-flex p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
        title="Excluir"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Excluir Galeria"
        message="Tem certeza que deseja apagar esta galeria? Todas as imagens anexadas a ela também serão perdidas."
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
        variant="danger"
      />
    </>
  );
}
