import { DataTable, type ColumnDef } from "../components/DataTable";
import { Alignment } from "../utils/datatable";
import { Button } from "../components/Button";
import { useNavigation } from "../core/Router";
import { MoreHorizontal, User, Mail, Shield, CheckCircle2, XCircle } from "lucide-react";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "User" | "Editor";
    status: "Active" | "Inactive";
    profile: {
        lastLogin: string;
        loginCount: number;
    };
}

const mockUsers: UserData[] = [
    {
        id: "1",
        name: "Max Mustermann",
        email: "max@example.com",
        role: "Admin",
        status: "Active",
        profile: {
            lastLogin: "2024-03-20 14:30",
            loginCount: 156
        }
    },
    {
        id: "2",
        name: "Erika Musterfrau",
        email: "erika@example.com",
        role: "Editor",
        status: "Active",
        profile: {
            lastLogin: "2024-03-21 09:15",
            loginCount: 89
        }
    },
    {
        id: "3",
        name: "John Doe",
        email: "john@example.com",
        role: "User",
        status: "Inactive",
        profile: {
            lastLogin: "2024-02-15 11:20",
            loginCount: 12
        }
    },
    {
        id: "4",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "User",
        status: "Active",
        profile: {
            lastLogin: "2024-03-22 16:45",
            loginCount: 45
        }
    }
];

const UserDetailsSheet = ({ user }: { user: UserData }) => {
    const nav = useNavigation();
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-variant/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold">{user.name}</h3>
                    <p className="text-sm text-on-surface-variant">{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-outline-variant">
                    <p className="text-xs text-on-surface-variant uppercase font-semibold">Rolle</p>
                    <p className="font-medium">{user.role}</p>
                </div>
                <div className="p-3 rounded-lg border border-outline-variant">
                    <p className="text-xs text-on-surface-variant uppercase font-semibold">Status</p>
                    <p className="font-medium text-primary">{user.status}</p>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-semibold text-sm">Aktivitäts-Details</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm py-2 border-b border-outline-variant">
                        <span className="text-on-surface-variant">Letzter Login</span>
                        <span className="font-medium">{user.profile.lastLogin}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-outline-variant">
                        <span className="text-on-surface-variant">Anzahl Logins</span>
                        <span className="font-medium">{user.profile.loginCount}</span>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
                <Button variant="filled" className="w-full">Profil Bearbeiten</Button>
                <Button variant="ghost" className="w-full text-error" onClick={() => nav.popBackStack()}>Benutzer Deaktivieren</Button>
            </div>
        </div>
    );
};

export const DataTableDemo = () => {
    const nav = useNavigation();

    const columns: ColumnDef<UserData>[] = [
        {
            accessorKey: "name",
            header: () => (
                <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Name</span>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: () => (
                <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>Email</span>
                </div>
            ),
        },
        {
            accessorKey: "role",
            header: () => (
                <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span>Rolle</span>
                </div>
            ),
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.role === 'Admin' ? 'bg-primary-container text-on-primary-container' :
                    row.role === 'Editor' ? 'bg-secondary-container text-on-secondary-container' :
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
                    {row.status === 'Active' ? (
                        <CheckCircle2 size={16} className="text-primary" />
                    ) : (
                        <XCircle size={16} className="text-error" />
                    )}
                    <span className={row.status === 'Active' ? 'text-primary' : 'text-error'}>
                        {row.status}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "profile.lastLogin",
            header: "Letzter Login"
        },
        {
            accessorKey: "profile.loginCount",
            header: "Logins",
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({ row }) => (
                <Button variant="ghost" size="icon" onClick={() => nav.navigate('user-details', { user: row })}>
                    <MoreHorizontal size={16} />
                </Button>
            )
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-on-surface mb-2">Data Table Demo</h1>
                    <p className="text-on-surface-variant">Ein Beispiel für die Verwendung der DataTable Komponente.</p>
                </div>
                <Button variant="outlined" onClick={() => nav.popBackStack()}>
                    Zurück
                </Button>
            </div>

            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-on-surface">1. Manuelle Spaltendefinition</h2>
                <p className="text-sm text-on-surface-variant mb-4">
                    Hier werden Spalten explizit definiert mit Custom-Rendering für Status, Rollen und Aktionen.
                </p>
                <DataTable
                    data={mockUsers}
                    columns={columns}
                    headerAlignment={Alignment.LEFT}
                />
            </section>

            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-on-surface">2. Automatische Spaltenerkennung</h2>
                <p className="text-sm text-on-surface-variant mb-4">
                    Wenn keine Spalten definiert sind, extrahiert die Komponente diese automatisch aus den Daten.
                    Verschachtelte Objekte werden ebenfalls erkannt.
                </p>
                <DataTable
                    data={mockUsers}
                    headerAlignment={Alignment.LEFT}
                />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4 text-on-surface">3. Andere Ausrichtungen</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium mb-2">Zentriert (Alignment.CENTER)</h3>
                        <DataTable
                            data={mockUsers.slice(0, 2)}
                            headerAlignment={Alignment.CENTER}
                            cellAlignment={Alignment.CENTER}
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium mb-2">Rechtsbündig (Alignment.RIGHT)</h3>
                        <DataTable
                            data={mockUsers.slice(0, 2)}
                            headerAlignment={Alignment.RIGHT}
                            cellAlignment={Alignment.RIGHT}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export { UserDetailsSheet };
