import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";

const settings = [
	"TanStack Router ist eingerichtet",
	"Routing laeuft ueber src/router.tsx",
	"Die CLI registriert neue Screens automatisch",
];

export function Settings() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
			<div className="grid gap-2">
				<h1 className="text-3xl font-semibold tracking-normal">
					Settings
				</h1>
				<p className="max-w-2xl text-sm text-muted-foreground">
					Diese Seite ist Teil des Starter-Routings und kann als
					Vorlage fuer eigene Bereiche dienen.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Projektstatus</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="grid gap-3 text-sm">
						{settings.map((item) => (
							<li key={item} className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-primary" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
