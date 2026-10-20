"use client";

import { useState, useEffect } from "react";
import { Instagram, RefreshCw, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useAutomationsController } from "../Automations/controller";
import { useSearchParams, useRouter } from "next/navigation";
import { handleOAuthCallback } from "../Automations/api/social-accounts";

export const SocialAccountsManager = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { 
    socialAccounts, 
    isLoadingAccounts, 
    connectInstagram 
  } = useAutomationsController();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleCallback(code);
    }
  }, [searchParams]);

  const handleCallback = async (code: string) => {
    try {
      await handleOAuthCallback(code);
      router.replace("/settings"); // Clear code from URL
      window.location.reload(); // Refresh window to update state
    } catch (err) {
      console.error("OAuth Callback failed", err);
      alert("Failed to connect Instagram account.");
    }
  };

  return (
    <div className="space-y-4">
      {isLoadingAccounts ? (
        <div className="flex items-center justify-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : socialAccounts.length > 0 ? (
        <div className="space-y-3">
          {socialAccounts.map((account) => (
            <Card key={account.id} hover className="overflow-hidden">
              <Card.Header 
                actions={
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase rounded-lg hover:bg-secondary">
                      Refresh
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg" onClick={(e) => { e.stopPropagation(); /* handle delete */ }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                }
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={account.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.username}`} 
                      className="w-12 h-12 rounded-xl border-2 border-background shadow-sm" 
                    />
                    <div className="absolute -bottom-1 -end-1 bg-background rounded-full p-0.5 shadow-sm border border-border">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm leading-none flex items-center gap-2 text-foreground group-hover:text-primary transition-colors">
                      {account.username}
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-black opacity-60">
                      Instagram Business
                    </p>
                  </div>
                </div>
              </Card.Header>
            </Card>
          ))}
          
          <Button 
            variant="outline" 
            // fullWidth 
            onClick={connectInstagram}
            className="border-dashed border-border mt-4 py-6 rounded-2xl text-muted-foreground"
          >
            <Instagram className="w-4 h-4 me-2" />
            Connect Another Account
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-muted/20 rounded-2xl border border-dashed border-border text-center">
          <div className="w-16 h-16 rounded-3xl bg-background flex items-center justify-center shadow-sm border border-border mb-4">
            <Instagram className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-sm font-bold mb-1">No Accounts Connected</h3>
          <p className="text-xs text-muted-foreground max-w-xs mb-6">
            Connect your Instagram Business account to start automating your direct messages and comments.
          </p>
          <Button 
            onClick={connectInstagram}
            className="gap-2 px-8"
          >
            <Instagram className="w-4 h-4" />
            Connect Instagram
          </Button>
        </div>
      )}

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-amber-700">Account Requirements</p>
          <p className="text-[10px] text-amber-600/80 leading-relaxed">
            Ensure your account is an <strong>Instagram Business</strong> account linked to a Facebook Page. 
            You must be an admin of the page to connect.
          </p>
        </div>
      </div>
    </div>
  );
};
