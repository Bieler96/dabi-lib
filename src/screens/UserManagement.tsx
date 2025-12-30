import { useState, useEffect } from "react";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { Button } from "../components/Button";
import { Plus } from "lucide-react";
import { useNavigation } from "../core/Router";
import { Sheet } from "../components/Sheet";

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
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => new Date(row.createdAt).toLocaleString(),
    },
];

export const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const nav = useNavigation();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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

            {loading ? (
                <div>Loading...</div>
            ) : (
                <DataTable columns={columns} data={users} />
            )}

            <AddUserSheet
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={() => {
                    setIsAddOpen(false);
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
