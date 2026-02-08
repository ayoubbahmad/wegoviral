"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";



interface AddNewItemProps {
    onAddHook?: (hook: any) => Promise<{ success: boolean; error?: string }>;
    onAddScript?: (script: any) => Promise<{ success: boolean; error?: string }>;
}

export function AddNewItem({ onAddHook, onAddScript }: AddNewItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<"hook" | "script">("hook");

    // Form states
    const [hookContent, setHookContent] = useState("");
    const [hookType, setHookType] = useState("Verbal");
    const [hookEmotion, setHookEmotion] = useState("Curiosity");

    const [scriptTitle, setScriptTitle] = useState("");
    const [scriptCategory, setScriptCategory] = useState("Educational");
    const [scriptSteps, setScriptSteps] = useState([{ step: "Hook", description: "" }]);

    const handleAddStep = () => {
        setScriptSteps([...scriptSteps, { step: "New Step", description: "" }]);
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        let result;
        if (type === "hook") {
            result = await onAddHook?.({
                content: hookContent,
                type: hookType,
                emotion: hookEmotion,
                topic: "General",
            });
        } else {
            result = await onAddScript?.({
                title: scriptTitle,
                category: scriptCategory,
                content: scriptSteps,
            });
        }

        if (result?.success) {
            setIsOpen(false);
            // Reset states
            setHookContent("");
            setScriptTitle("");
            setScriptSteps([{ step: "Hook", description: "" }]);
        } else {
            alert(result?.error || "Failed to save item");
        }
        setIsLoading(false);
    };

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
                <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="flex bg-secondary p-1 rounded-lg mb-6 sticky top-0 z-10">
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

                    <form className="space-y-4" onSubmit={handleSave}>
                        {type === "hook" ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Content</label>
                                    <textarea
                                        value={hookContent}
                                        onChange={(e) => setHookContent(e.target.value)}
                                        className="w-full min-h-[100px] p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="Write your hook here..."
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Type</label>
                                        <select
                                            value={hookType}
                                            onChange={(e) => setHookType(e.target.value)}
                                            className="w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option>Verbal</option>
                                            <option>Visual</option>
                                            <option>Text</option>
                                            <option>Audio</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Emotion</label>
                                        <select
                                            value={hookEmotion}
                                            onChange={(e) => setHookEmotion(e.target.value)}
                                            className="w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option>Curiosity</option>
                                            <option>Fear</option>
                                            <option>Humor</option>
                                            <option>Desire</option>
                                            <option>Surprise</option>
                                            <option>Inspiration</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Script Title</label>
                                    <input
                                        type="text"
                                        value={scriptTitle}
                                        onChange={(e) => setScriptTitle(e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="e.g. 1-Minute Educational Reel"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Category</label>
                                    <select
                                        value={scriptCategory}
                                        onChange={(e) => setScriptCategory(e.target.value)}
                                        className="w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option>Educational</option>
                                        <option>Entertainment</option>
                                        <option>Sales</option>
                                        <option>Storytelling</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium">Structure Steps</label>
                                        <button
                                            type="button"
                                            onClick={handleAddStep}
                                            className="text-xs text-primary font-medium hover:underline"
                                        >
                                            + Add Step
                                        </button>
                                    </div>
                                    {scriptSteps.map((step, index) => (
                                        <div key={index} className="flex gap-3 items-start">
                                            <input
                                                type="text"
                                                value={step.step}
                                                onChange={(e) => {
                                                    const newSteps = [...scriptSteps];
                                                    newSteps[index].step = e.target.value;
                                                    setScriptSteps(newSteps);
                                                }}
                                                className="w-1/3 p-2 text-sm rounded-lg border border-input bg-background"
                                                placeholder="Step name"
                                            />
                                            <input
                                                type="text"
                                                value={step.description}
                                                onChange={(e) => {
                                                    const newSteps = [...scriptSteps];
                                                    newSteps[index].description = e.target.value;
                                                    setScriptSteps(newSteps);
                                                }}
                                                className="flex-1 p-2 text-sm rounded-lg border border-input bg-background"
                                                placeholder="What happens in this step..."
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="pt-4 sticky bottom-0 bg-background pb-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
                            >
                                {isLoading ? "Saving..." : (type === "hook" ? "Save Hook" : "Save Script Template")}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
