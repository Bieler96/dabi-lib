import { useState, useEffect } from "react";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { Button } from "../components/Button";
import { Sheet } from "../components/Sheet";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useNavigation } from "../core/Router";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "../components/Pagination";
import { Input } from "../components/Input";
import { CopyButton } from "../components/CopyButton";

// Types matching the API
type User = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
};

// DataTable Columns
const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <CopyButton text={row.name} label={row.name} />
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return (
                <CopyButton text={row.email} label={row.email} />
            );
        },
    },
    // {
    //     accessorKey: "createdAt",
    //     header: "Created At",
    //     cell: ({ row }) => new Date(row.createdAt).toLocaleString(),
    // },
];

interface UserManagementProps {
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const getColumns = ({ onEdit, onDelete }: UserManagementProps): ColumnDef<User>[] => [
    ...columns,
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
                    <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-error hover:bg-error/10" onClick={() => onDelete(row.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        )
    }
];

export const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(2);
    const [metadata, setMetadata] = useState<{ total: number; totalPages: number } | null>(null);
    const [inputFilters, setInputFilters] = useState({
        search: "",
        before: "",
        after: ""
    });
    const [activeFilters, setActiveFilters] = useState({
        search: "",
        before: "",
        after: ""
    });
    const nav = useNavigation();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(activeFilters.search && { search: activeFilters.search }),
                ...(activeFilters.before && { createdAtBefore: activeFilters.before }),
                ...(activeFilters.after && { createdAtAfter: activeFilters.after }),
            });
            const res = await fetch(`/api/users?${params.toString()}`);
            const result = await res.json();
            setUsers(result.data || []);
            setMetadata(result.metadata || null);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
            if (res.ok) fetchUsers();
            else alert("Failed to delete user");
        } catch (error) {
            console.error(error);
        }
    };

    const actionColumns = getColumns({
        onEdit: (user) => setEditUser(user),
        onDelete: handleDelete
    });

    useEffect(() => {
        fetchUsers();
    }, [page, limit, activeFilters]);

    const handleApplyFilters = () => {
        setActiveFilters(inputFilters);
        setPage(1);
    };

    const handleResetFilters = () => {
        const reset = { search: "", before: "", after: "" };
        setInputFilters(reset);
        setActiveFilters(reset);
        setPage(1);
    };

    const refresh = () => fetchUsers();

    return (
        <div className="p-8 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-on-surface-variant">Fullstack example with Drizzle & SQLite</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outlined" onClick={() => nav.popBackStack()}>Back</Button>
                    <Button variant="filled" onClick={() => setIsAddOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-variant/20 p-4 rounded-lg items-end">
                <div className="flex flex-col gap-1">
                    <Input
                        label="Search Name"
                        placeholder="Search by name..."
                        value={inputFilters.search}
                        onChange={e => setInputFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        label="Created After"
                        type="date"
                        value={inputFilters.after}
                        onChange={e => setInputFilters(prev => ({ ...prev, after: e.target.value }))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        label="Created Before"
                        type="date"
                        value={inputFilters.before}
                        onChange={e => setInputFilters(prev => ({ ...prev, before: e.target.value }))}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="filled" className="flex-1" onClick={handleApplyFilters}>Apply</Button>
                    <Button variant="outlined" onClick={handleResetFilters}>Reset</Button>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center border rounded-lg bg-surface-variant/10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable columns={actionColumns} data={users} />
                )}

                <div className="flex justify-center mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page > 1) setPage(p => p - 1);
                                    }}
                                    className={(page === 1 || loading) ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {[...Array(Math.max(1, metadata?.totalPages || 0))].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === i + 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (!loading) setPage(i + 1);
                                        }}
                                        className={loading ? "pointer-events-none opacity-50" : ""}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page < (metadata?.totalPages || 0)) setPage(p => p + 1);
                                    }}
                                    className={((metadata && page >= metadata.totalPages) || loading) ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            <AddUserSheet
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={() => {
                    setIsAddOpen(false);
                    refresh();
                }}
            />

            <EditUserSheet
                user={editUser}
                isOpen={!!editUser}
                onClose={() => setEditUser(null)}
                onSuccess={() => {
                    setEditUser(null);
                    refresh();
                }}
            />
        </div>
    );
};

const AddUserSheet = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });
            if (res.ok) {
                setName("");
                setEmail("");
                onSuccess();
            } else {
                alert("Failed to create user");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating user");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Sheet
            isOpen={isOpen}
            onClose={onClose}
            side="right"
            title="Add New User"
            description="Create a new user in the SQLite database."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Name</label>
                    <input
                        className="p-2 border rounded-md bg-surface border-outline"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="p-2 border rounded-md bg-surface border-outline"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="filled" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create User'}
                    </Button>
                </div>
            </form>
        </Sheet>
    );
};

const EditUserSheet = ({ user, isOpen, onClose, onSuccess }: { user: User | null, isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });
            if (res.ok) {
                onSuccess();
            } else {
                alert("Failed to update user");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating user");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Sheet
            isOpen={isOpen}
            onClose={onClose}
            side="right"
            title="Edit User"
            description="Update user information in the database."
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Name</label>
                    <input
                        className="p-2 border rounded-md bg-surface border-outline"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="p-2 border rounded-md bg-surface border-outline"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* metadata */}
                {user && (
                    <div className="flex flex-row gap-1">
                        <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="filled" disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update User'}
                    </Button>
                </div>
            </form>
        </Sheet>
    );
};
