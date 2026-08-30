"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@growthcoder/ui";
import {
  Mail,
  Send,
  ExternalLink,
  Loader2,
  FileEdit,
  User,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { ContactInbox } from "@growthcoder/types";

interface InboxReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inbox: ContactInbox | null;
  onSuccess: (updatedInbox: ContactInbox) => void;
}

export function InboxReplyDialog({
  open,
  onOpenChange,
  inbox,
  onSuccess,
}: InboxReplyDialogProps) {
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [replyNotes, setReplyNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (inbox) {
      const origSubject = inbox.subject
        ? `Re: ${inbox.subject}`
        : "Tanggapan Terkait Pesan Anda di GrowthCoder";
      setSubject(origSubject);
      setEmailBody(
        `Halo ${inbox.name},\n\nTerima kasih telah menghubungi kami. Kami telah menerima pesan Anda mengenai:\n"${inbox.message.slice(0, 120)}${inbox.message.length > 120 ? "..." : ""}"\n\n[Tuliskan tanggapan Anda di sini]\n\nSalam hangat,\nMuhammad Ihsan Maulana\nGrowthCoder Engineering`,
      );
      setReplyNotes(inbox.replyNotes || "");
    }
  }, [inbox]);

  if (!inbox) return null;

  const handleLaunchMailto = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(inbox.email)}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, "_blank");
  };

  const handleSaveAndMarkReplied = async () => {
    setIsSubmitting(true);
    try {
      const res = await apiClient.patch<ContactInbox>(
        `/api/admin/inboxes/${inbox.id}/status`,
        {
          status: "replied",
          replyNotes: replyNotes.trim() || undefined,
        },
      );

      if (res.success && res.data) {
        toast.success(
          `Pesan dari ${inbox.name} ditandai sebagai telah dibalas`,
        );
        onSuccess(res.data);
        onOpenChange(false);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memperbarui status pesan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shadow-xs shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground text-left">
                Balas Pesan Kontak
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-left">
                Kirim tanggapan langsung ke pengirim dan simpan catatan tindak
                lanjut.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4.5 custom-scrollbar">
          {/* Recipient info summary */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/60 text-xs">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="font-semibold text-foreground">
                  {inbox.name}
                </span>
                <span className="text-muted-foreground ml-1.5">
                  &lt;{inbox.email}&gt;
                </span>
              </div>
            </div>
          </div>

          {/* Email Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Subjek Email
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-sm h-10"
            />
          </div>

          {/* Email Body Draft */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Draft Isi Email
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLaunchMailto}
                className="text-xs h-7 text-primary hover:text-primary gap-1 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka di Email Client
                (Mailto)
              </Button>
            </div>
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={6}
              className="text-sm font-sans leading-relaxed min-h-[140px] resize-y custom-scrollbar"
            />
          </div>

          {/* Admin Internal Reply Notes */}
          <div className="space-y-1.5 pt-3 border-t border-border/70">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileEdit className="w-3.5 h-3.5 text-muted-foreground" />
              Catatan Internal / Ringkasan Balasan (Opsional)
            </label>
            <Textarea
              value={replyNotes}
              onChange={(e) => setReplyNotes(e.target.value)}
              rows={2}
              placeholder="Contoh: Sudah dikirim proposal teknis via email, meeting dijadwalkan Jumat jam 14:00..."
              className="text-sm resize-none custom-scrollbar"
            />
            <p className="text-[11px] text-muted-foreground">
              Catatan ini disimpan untuk tim internal sebagai riwayat tindak
              lanjut.
            </p>
          </div>
        </div>

        <DialogFooter className="p-4 px-6 border-t border-border/70 shrink-0 bg-muted/30 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-xs h-9 px-4"
          >
            Batal
          </Button>

          <Button
            onClick={handleSaveAndMarkReplied}
            disabled={isSubmitting}
            className="text-xs h-9 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Tandai Sebagai Telah Dibalas
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
