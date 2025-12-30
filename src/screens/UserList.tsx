import type { ColumnDef } from "../components/DataTable";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
    lastLogin: string;
}

export const users: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", lastLogin: "2024-03-10" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Inactive", lastLogin: "2024-02-14" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Editor", status: "Active", lastLogin: "2024-03-09" },
    { id: 4, name: "David Wilson", email: "david@example.com", role: "User", status: "Active", lastLogin: "2024-03-11" },
    { id: 5, name: "Eva Davis", email: "eva@example.com", role: "Admin", status: "Active", lastLogin: "2024-03-08" },
];

export const userColumns: ColumnDef<User>[] = [
    { accessorKey: "id", header: "ID" },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-semibold text-primary">{row.name}</span>
    },
    { accessorKey: "email", header: "Email" },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <span className={`px-2 py-1 rounded-full text-xs ${row.role === 'Admin' ? 'bg-primary/20 text-primary' :
                row.role === 'Editor' ? 'bg-secondary/20 text-secondary' :
                    'bg-surface-variant text-on-surface-variant'
                }`}>
                {row.role}
            </span>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${row.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                {row.status}
            </div>
        )
    },
    {
        accessorKey: "actions",
        header: "",
        cell: ({ row }) => (
            <button
                className="text-primary hover:underline text-sm"
                onClick={(e) => {
                    e.stopPropagation();
                    alert(`Edit user ${row.name}`);
                }}
            >
                Edit
            </button>
        )
    }
];
