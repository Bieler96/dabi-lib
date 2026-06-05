import { Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Sparkles } from "lucide-react";
import { buttonVariants } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { cn } from "../utils/cn";

export function Home() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
			<section className="grid gap-3">
				<div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
					<Sparkles className="size-5" />
				</div>
				<div className="grid gap-2">
					<h1 className="text-3xl font-semibold tracking-normal">
						Dashboard
					</h1>
					<p className="max-w-2xl text-sm text-muted-foreground">
						Ein schlanker Startpunkt fuer neue Projekte mit dabi-lib
						Komponenten und TanStack Router.
					</p>
				</div>
			</section>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Boxes className="size-4 text-primary" />
							Grundaufbau
						</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4 text-sm text-muted-foreground">
						<p>
							Die Route-Definitionen liegen zentral in
							<code className="mx-1 rounded bg-muted px-1 py-0.5">
								src/router.tsx
							</code>
							und werden in
							<code className="mx-1 rounded bg-muted px-1 py-0.5">
								src/main.tsx
							</code>
							gerendert.
						</p>
						<Link
							to="/settings"
							className={cn(
								buttonVariants({ variant: "outlined" }),
								"w-fit",
							)}
						>
							Settings ansehen
							<ArrowRight data-icon="inline-end" />
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">
							Neue Screens
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						<p>
							Mit
							<code className="mx-1 rounded bg-muted px-1 py-0.5">
								dabi generate screen Name
							</code>
							entsteht ein Screen und die passende TanStack Route
							wird direkt registriert.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
