"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function AddNewItem() {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<"hook" | "script">("hook");

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={type === "hook" ? "Add New Hook" : "Add Script Template"}
            >
                <div className="space-y-4">
                    <div className="flex bg-secondary p-1 rounded-lg mb-6">
                        <button
                            onClick={() => setType("hook")}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === "hook" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Hook
                        </button>
                        <button
                            onClick={() => setType("script")}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === "script" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Script
                        </button>
                    </div>

                    {type === "hook" ? (
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsOpen(false); }}>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Content</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Write your hook here..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Type</label>
                                    <select className="w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                                        <option>Verbal</option>
                                        <option>Visual</option>
                                        <option>Text</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Emotion</label>
                                    <select className="w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                                        <option>Curiosity</option>
                                        <option>Fear</option>
                                        <option>Humor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90">
                                    Save Hook
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Script template builder coming soon...</p>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
