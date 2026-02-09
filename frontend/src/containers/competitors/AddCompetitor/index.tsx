"use client";

import { Modal } from "@/components/Modal";
import { useToast } from "@/providers/Toast";
import { useState } from "react";
import { AtSign, User } from "lucide-react";

import { Competitor } from "@/types/competitor";

interface AddCompetitorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd?: (competitor: any) => Promise<{ success: boolean; error?: string }>;
}

export function AddCompetitorModal({ isOpen, onClose, onAdd }: AddCompetitorModalProps) {
    const { showToast } = useToast();
    const [handle, setHandle] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await onAdd?.({
            name: name,
            handle: handle.startsWith('@') ? handle : `@${handle}`,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`,
            bio: "New competitor added via Creator OS",
            tags: ["New"],
            stats: {
                followers: "10K",
                avgLikes: "500",
                engagementRate: "5%"
            },
            isFollowing: true
        } as any); // Using 'as any' to match the provided instruction, though a more specific type would be better.

        if (result?.success) {
            showToast(`Competitor @${handle} added successfully!`, "success");
            setHandle("");
            setName("");
            onClose();
        } else {
            showToast(result?.error || "Failed to add competitor", "error");
        }
        setLoading(false);
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
