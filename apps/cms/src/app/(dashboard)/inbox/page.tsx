"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Inbox,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  Reply,
  Archive,
  Trash2,
  Eye,
  Send,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Mail,
  DollarSign,
  Filter,
} from "lucide-react";
import {
  Button,
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@growthcoder/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { InboxDetailDialog } from "@/components/inbox/inbox-detail-dialog";
import { InboxReplyDialog } from "@/components/inbox/inbox-reply-dialog";
import type {
  ContactInbox,
  InboxStatus,
  PaginatedResponse,
} from "@growthcoder/types";

export default function InboxPage() {
  const [inboxes, setInboxes] = useState<ContactInbox[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const [meta, setMeta] = useState({ total: 0, lastPage: 1 });

  // Dialog states
  const [detailItem, setDetailItem] = useState<ContactInbox | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [replyItem, setReplyItem] = useState<ContactInbox | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);

  const [deleteItem, setDeleteItem] = useState<ContactInbox | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInboxes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("perPage", String(perPage));
      if (statusFilter && statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await apiClient.get<ContactInbox[]>(
        `/api/admin/inboxes?${params.toString()}`,
      );
      if (res.success && res.data) {
        setInboxes(res.data);
        const paginated = res as unknown as PaginatedResponse<ContactInbox>;
        if (paginated.meta) {
          setMeta({
            total: paginated.meta.total,
            lastPage: paginated.meta.lastPage,
          });
        }
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat daftar pesan masuk");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, statusFilter, search]);

  useEffect(() => {
    fetchInboxes();
  }, [fetchInboxes]);

  // Real-time live update when a new lead arrives via Transmit
  useEffect(() => {
    const handleNewInbox = (e: Event) => {
      const customEvent = e as CustomEvent<ContactInbox>;
      if (customEvent.detail) {
        const newMsg = customEvent.detail;
        setInboxes((prev) => [
          newMsg,
          ...prev.filter((x) => x.id !== newMsg.id),
        ]);
        setMeta((prev) => ({ ...prev, total: prev.total + 1 }));
      }
    };

    window.addEventListener("growthcoder:new-inbox", handleNewInbox);
    return () => {
      window.removeEventListener("growthcoder:new-inbox", handleNewInbox);
    };
  }, []);

  // Count stats
  const stats = useMemo(() => {
    const total = inboxes.length;
    const unread = inboxes.filter((i) => i.status === "unread").length;
    const replied = inboxes.filter((i) => i.status === "replied").length;
    const archived = inboxes.filter((i) => i.status === "archived").length;
    return { total, unread, replied, archived };
  }, [inboxes]);

  // Handlers
  const handleOpenDetail = async (item: ContactInbox) => {
    setDetailItem(item);
    setDetailOpen(true);

    // Mark as read in local state if unread
    if (item.status === "unread") {
      try {
        await apiClient.get(`/api/admin/inboxes/${item.id}`);
        setInboxes((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, status: "read" } : x)),
        );
      } catch {
        // ignore
      }
    }
  };

  const handleOpenReply = (item: ContactInbox) => {
    setReplyItem(item);
    setReplyOpen(true);
  };

  const handleUpdateStatus = async (
    item: ContactInbox,
    newStatus: InboxStatus,
  ) => {
    try {
      const res = await apiClient.patch<ContactInbox>(
        `/api/admin/inboxes/${item.id}/status`,
        {
          status: newStatus,
        },
      );
      if (res.success && res.data) {
        setInboxes((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, status: newStatus } : x)),
        );
        if (detailItem && detailItem.id === item.id) {
          setDetailItem({ ...detailItem, status: newStatus });
        }
        toast.success(`Status pesan diubah menjadi "${newStatus}"`);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal mengubah status pesan");
    }
  };

  const handleReplySuccess = (updated: ContactInbox) => {
    setInboxes((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    if (detailItem && detailItem.id === updated.id) {
      setDetailItem(updated);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/inboxes/${deleteItem.id}`);
      setInboxes((prev) => prev.filter((x) => x.id !== deleteItem.id));
      toast.success(`Pesan dari ${deleteItem.name} berhasil dihapus`);
      setDeleteItem(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal menghapus pesan");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateShort = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: InboxStatus) => {
    switch (status) {
      case "unread":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Unread
          </Badge>
        );
      case "read":
        return (
          <Badge
            variant="outline"
            className="text-blue-500 border-blue-500/30 text-[11px]"
          >
            Read
          </Badge>
        );
      case "replied":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[11px]">
            <Reply className="w-3 h-3 mr-1" />
            Replied
          </Badge>
        );
      case "archived":
        return (
          <Badge
            variant="secondary"
            className="text-muted-foreground text-[11px]"
          >
            Archived
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xs">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Pesan Masuk & Prospek (Inbox)
              </h1>
              <p className="text-xs text-muted-foreground">
                Daftar pertanyaan, penawaran proyek, dan leads langsung dari
                formulir kontak website publik.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInboxes}
            disabled={isLoading}
            className="text-xs h-9"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Pesan</span>
            <Inbox className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {meta.total || stats.total}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Seluruh riwayat kontak
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Belum Dibaca</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.unread}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Perlu segera ditinjau
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Telah Dibalas</span>
            <Reply className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.replied}</p>
          <p className="text-[11px] text-muted-foreground">
            Follow-up terselesaikan
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Diarsipkan</span>
            <Archive className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.archived}</p>
          <p className="text-[11px] text-muted-foreground">
            Pesan selesai / referensi
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/40">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari pengirim, email, subjek, atau pesan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={statusFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setPage(1);
            }}
            className="h-8 text-xs rounded-lg whitespace-nowrap"
          >
            Semua
          </Button>
          <Button
            variant={statusFilter === "unread" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setStatusFilter("unread");
              setPage(1);
            }}
            className="h-8 text-xs rounded-lg whitespace-nowrap flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Unread
          </Button>
          <Button
            variant={statusFilter === "read" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setStatusFilter("read");
              setPage(1);
            }}
            className="h-8 text-xs rounded-lg whitespace-nowrap"
          >
            Read
          </Button>
          <Button
            variant={statusFilter === "replied" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setStatusFilter("replied");
              setPage(1);
            }}
            className="h-8 text-xs rounded-lg whitespace-nowrap"
          >
            Replied
          </Button>
          <Button
            variant={statusFilter === "archived" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setStatusFilter("archived");
              setPage(1);
            }}
            className="h-8 text-xs rounded-lg whitespace-nowrap"
          >
            Archived
          </Button>
        </div>
      </div>

      {/* Inbox List / Table */}
      <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">
              Memuat daftar pesan masuk...
            </p>
          </div>
        ) : inboxes.length > 0 ? (
          <div className="divide-y divide-border">
            {inboxes.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-muted/40 cursor-pointer ${
                  item.status === "unread"
                    ? "bg-emerald-500/5 dark:bg-emerald-950/10 font-medium"
                    : ""
                }`}
                onClick={() => handleOpenDetail(item)}
              >
                {/* Left Side: Avatar & Sender Details */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                      item.status === "unread"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-foreground truncate">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        &lt;{item.email}&gt;
                      </span>
                      {renderStatusBadge(item.status)}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-foreground font-semibold truncate max-w-md">
                        {item.subject || "(Tanpa Subjek)"}
                      </p>
                      <span className="text-xs text-muted-foreground">—</span>
                      <p className="text-xs text-muted-foreground truncate max-w-lg">
                        {item.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                      {item.projectCategory && (
                        <span className="font-medium text-foreground/80">
                          {item.projectCategory}
                        </span>
                      )}
                      {item.budgetRange && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                          <DollarSign className="w-3 h-3" />
                          {item.budgetRange}
                        </span>
                      )}
                      <span>{formatDateShort(item.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action Buttons */}
                <div
                  className="flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDetail(item)}
                    className="h-8 text-xs px-2.5"
                    title="Lihat Detail Pesan"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Detail
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleOpenReply(item)}
                    className="h-8 text-xs px-2.5 bg-primary text-primary-foreground font-semibold"
                    title="Balas Pesan Ini"
                  >
                    <Reply className="w-3.5 h-3.5 mr-1" />
                    Balas
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {item.status !== "unread" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(item, "unread")}
                        >
                          <Clock className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                          Tandai Belum Dibaca
                        </DropdownMenuItem>
                      )}
                      {item.status !== "read" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(item, "read")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-blue-500" />
                          Tandai Sudah Dibaca
                        </DropdownMenuItem>
                      )}
                      {item.status !== "replied" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(item, "replied")}
                        >
                          <Reply className="w-3.5 h-3.5 mr-2 text-purple-500" />
                          Tandai Telah Dibalas
                        </DropdownMenuItem>
                      )}
                      {item.status !== "archived" ? (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(item, "archived")}
                        >
                          <Archive className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                          Arsipkan Pesan
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(item, "read")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-blue-500" />
                          Batal Arsip
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => setDeleteItem(item)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Hapus Pesan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 mx-auto flex items-center justify-center text-muted-foreground">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {search || statusFilter !== "all"
                  ? "Tidak ada pesan yang cocok dengan filter"
                  : "Belum Ada Pesan Masuk"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {search || statusFilter !== "all"
                  ? "Coba ganti kata kunci pencarian atau reset filter status."
                  : "Pesan dari calon klien via form kontak website akan tampil secara otomatis di sini."}
              </p>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {meta.lastPage > 1 && (
          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-card/40">
            <span>
              Halaman {page} dari {meta.lastPage} (Total {meta.total} pesan)
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={page >= meta.lastPage || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <InboxDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        inbox={detailItem}
        onOpenReply={(item) => handleOpenReply(item)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Reply Dialog */}
      <InboxReplyDialog
        open={replyOpen}
        onOpenChange={setReplyOpen}
        inbox={replyItem}
        onSuccess={handleReplySuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-1">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Hapus Pesan Masuk?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus pesan dari{" "}
              <strong className="text-foreground">
                &quot;{deleteItem?.name}&quot;
              </strong>
              ? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/70">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteItem(null)}
              disabled={isDeleting}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-xs h-9 px-4 font-semibold shadow-xs"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus Pesan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
