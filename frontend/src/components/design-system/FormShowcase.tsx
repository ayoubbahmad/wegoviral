import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { Card } from "../ui/Card";
import { SearchInput } from "../ui/SearchInput";

export function FormShowcase() {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Basic Inputs */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Input Fields</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="Enter your name..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" placeholder="hello@creatoros.ai" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="disabled">Disabled State</Label>
                                <Input id="disabled" disabled value="Cannot edit this" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Specialty Inputs</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Standard Search</Label>
                                <SearchInput placeholder="Search everything..." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Textarea & Complex */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Textareas</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bio">Biography</Label>
                                <Textarea id="bio" placeholder="Tell us about yourself..." />
                                <p className="text-[10px] text-muted-foreground italic">Character limit: 500</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em]">Form In Card</p>
                        <Card variant="glass" padding="md" className="space-y-4">
                            <div className="space-y-2">
                                <Label>Automation Keyword</Label>
                                <Input placeholder="e.g. community" className="font-mono text-primary font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label>AI Prompt</Label>
                                <Textarea placeholder="Describe your video..." className="min-h-[80px]" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
