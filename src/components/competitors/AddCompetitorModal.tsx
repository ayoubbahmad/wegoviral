"use client";

import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useState } from "react";
import { AtSign, User } from "lucide-react";

interface AddCompetitorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCompetitorModal({ isOpen, onClose }: AddCompetitorModalProps) {
    const { showToast } = useToast();
    const [handle, setHandle] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock API call
        setTimeout(() => {
            showToast(`Competitor @${handle} added successfully!`, "success");
            setLoading(false);
            setHandle("");
            setName("");
            onClose();
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Competitor">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-1 block">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            required
                            placeholder="e.g. Alex Hormozi"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full px-4 py-2 pl-10 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-1 block">Instagram Handle</label>
                    <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            required
                            placeholder="hormozi"
                            value={handle}
                            onChange={e => setHandle(e.target.value)}
                            className="w-full px-4 py-2 pl-10 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Competitor"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
