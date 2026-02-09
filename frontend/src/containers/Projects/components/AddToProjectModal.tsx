'use client';

import { Modal } from "@/components/Modal";
import { Folder, Plus, Check, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
}

const MOCK_PROJECTS = [
    { id: '1', name: "Personal Brand 2024", items: 12 },
    { id: '2', name: "Client Work: Fitness", items: 5 },
    { id: '3', name: "YouTube Main Channel", items: 48 },
    { id: '4', name: "TikTok Shorts Batch", items: 8 },
    { id: '5', name: "Steal like an artist", items: 15 },
    { id: '6', name: "Tutorials", items: 22 },
];

export function AddToProjectModal({ isOpen, onClose, videoTitle }: AddToProjectModalProps) {
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleProject = (id: string) => {
    setSelectedProjectIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredProjects = MOCK_PROJECTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save to Project">
      <div className="space-y-6">
        <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Saving Video</p>
            <h3 className="text-sm font-bold text-foreground line-clamp-1">{videoTitle}</h3>
        </div>

        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
                type="text" 
                placeholder="Search or create project..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/20 border border-border/50 rounded-xl pl-10 pr-4 py-2 text-sm font-medium outline-none focus:border-primary/50 transition-colors"
            />
        </div>

        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredProjects.map((project) => (
                <button
                    key={project.id}
                    onClick={() => toggleProject(project.id)}
                    className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                        selectedProjectIds.includes(project.id) 
                            ? "bg-primary/10 border border-primary/20" 
                            : "hover:bg-secondary/30 border border-transparent"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            selectedProjectIds.includes(project.id) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:text-foreground"
                        )}>
                            <Folder className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <p className={cn(
                                "text-sm font-bold transition-colors",
                                selectedProjectIds.includes(project.id) ? "text-primary" : "text-foreground"
                            )}>{project.name}</p>
                            <p className="text-[10px] font-medium text-muted-foreground">{project.items} items</p>
                        </div>
                    </div>
                    {selectedProjectIds.includes(project.id) && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            <Check className="w-3 h-3" />
                        </div>
                    )}
                </button>
            ))}

            {filteredProjects.length === 0 && searchQuery && (
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-all text-left">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold">Create new project "{searchQuery}"</span>
                </button>
            )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <p className="text-xs font-bold text-muted-foreground">
                {selectedProjectIds.length} projects selected
            </p>
            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={() => {
                        // In a real app, this would trigger the save action
                        onClose();
                    }}
                    disabled={selectedProjectIds.length === 0}
                    className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                >
                    Save Changes
                </button>
            </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </Modal>
  );
}
