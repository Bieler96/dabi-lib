import { useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigation } from "../core/Router";
import { Status } from "../components/Status";
import { Plus, MoreHorizontal, CheckCircle2, Circle, Clock } from "lucide-react";
import clsx from "clsx";

export interface Task {
    id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    assignee: string;
    tags: string[];
    description: string;
}

export const initialTasks: Task[] = [
    {
        id: "TASK-1",
        title: "Implement Login Page",
        status: "todo",
        priority: "high",
        assignee: "David",
        tags: ["frontend", "auth"],
        description: "Create a login page with email and password fields. Include validation and error handling."
    },
    {
        id: "TASK-2",
        title: "Setup Database Schema",
        status: "in-progress",
        priority: "high",
        assignee: "Sarah",
        tags: ["backend", "db"],
        description: "Design and implement the initial database schema for users and projects."
    },
    {
        id: "TASK-3",
        title: "Design System Tokens",
        status: "done",
        priority: "medium",
        assignee: "Alex",
        tags: ["design", "ui"],
        description: "Define color palette, typography and spacing tokens in Figma and export to CSS."
    },
    {
        id: "TASK-4",
        title: "Fix Navigation Bug",
        status: "todo",
        priority: "medium",
        assignee: "David",
        tags: ["bug", "frontend"],
        description: "Navigation state is lost when refreshing the page on the detailed view."
    }
];

export const JiraBoard = () => {
    const nav = useNavigation();
    const [tasks] = useState<Task[]>(initialTasks);

    const getTasksByStatus = (status: Task['status']) => tasks.filter(t => t.status === status);

    const handleTaskClick = (task: Task) => {
        nav.navigate('jira-task-details', { task });
    };

    return (
        <div className="h-full flex flex-col bg-surface overflow-hidden">
            {/* Header */}
            <div className="border-b border-outline-variant px-6 py-4 flex items-center justify-between bg-surface z-10">
                <div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-1">
                        <span>Projects</span>
                        <span>/</span>
                        <span>Dabi-Lib</span>
                    </div>
                    <h1 className="text-2xl font-bold text-on-surface">Sprint Board</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outlined" size="sm">Complete Sprint</Button>
                    <Button variant="filled" size="sm"><Plus className="w-4 h-4 mr-2" />Create Issue</Button>
                </div>
            </div>

            {/* Board Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex gap-6 h-full min-w-max">
                    <StatusColumn
                        title="To Do"
                        tasks={getTasksByStatus('todo')}
                        count={getTasksByStatus('todo').length}
                        onTaskClick={handleTaskClick}
                    />
                    <StatusColumn
                        title="In Progress"
                        tasks={getTasksByStatus('in-progress')}
                        count={getTasksByStatus('in-progress').length}
                        onTaskClick={handleTaskClick}
                    />
                    <StatusColumn
                        title="Done"
                        tasks={getTasksByStatus('done')}
                        count={getTasksByStatus('done').length}
                        onTaskClick={handleTaskClick}
                    />
                </div>
            </div>
        </div>
    );
};

const StatusColumn = ({ title, tasks, count, onTaskClick }: { title: string, tasks: Task[], count: number, onTaskClick: (t: Task) => void }) => {
    return (
        <div className="w-80 flex flex-col h-full bg-surface-variant/30 rounded-xl p-3 gap-3">
            <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">{title}</h3>
                    <span className="bg-surface-variant px-2 py-0.5 rounded-full text-xs font-medium text-on-surface-variant min-w-[20px] text-center">
                        {count}
                    </span>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="w-4 h-4 text-on-surface-variant" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="w-4 h-4 text-on-surface-variant" /></Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                {tasks.map(task => (
                    <div key={task.id} onClick={() => onTaskClick(task)}>
                        <TaskCard task={task} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const TaskCard = ({ task }: { task: Task }) => {
    const priorityColor = {
        low: "bg-blue-100 text-blue-700",
        medium: "bg-yellow-100 text-yellow-700",
        high: "bg-red-100 text-red-700"
    }[task.priority];

    const StatusIcon = {
        'todo': Circle,
        'in-progress': Clock,
        'done': CheckCircle2
    }[task.status];

    return (
        <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 border-outline-variant/50 hover:border-primary/50 p-4! bg-surface">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-on-surface-variant hover:underline cursor-pointer">{task.id}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-variant rounded transition-opacity">
                        <MoreHorizontal className="w-4 h-4 text-on-surface-variant" />
                    </button>
                </div>

                <h4 className="text-sm font-medium text-on-surface leading-snug">{task.title}</h4>

                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4 text-on-surface-variant" />
                        <div className={clsx("text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase", priorityColor)}>
                            {task.priority}
                        </div>
                    </div>
                    {task.assignee && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary border border-surface shadow-sm">
                            {task.assignee.charAt(0)}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export const JiraTaskDetails = ({ task }: { task: Task }) => {
    // In a real app, you might fetch fresh data here using task.id
    // For now we just use the passed param

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-1">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="hover:underline cursor-pointer">Dabi-Lib</span>
                        <span>/</span>
                        <span className="hover:underline cursor-pointer">{task.id}</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-on-surface mb-6">{task.title}</h1>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-6">
                        <section>
                            <h3 className="text-sm font-semibold text-on-surface mb-2">Description</h3>
                            <div className="p-3 rounded-lg hover:bg-surface-variant/30 min-h-[100px] cursor-text transition-colors">
                                <p className="text-sm text-on-surface-variant leading-relaxed">
                                    {task.description}
                                </p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-sm font-semibold text-on-surface mb-2">Activity</h3>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                    D
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="text-sm border border-outline-variant rounded-md p-3 bg-surface focus-within:ring-2 focus-within:ring-primary/20">
                                        <textarea
                                            placeholder="Add specific comments..."
                                            className="w-full bg-transparent border-none focus:outline-none text-sm resize-none min-h-[40px]"
                                        />
                                        <div className="flex justify-end pt-2">
                                            <Button size="sm" variant="filled">Save</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="col-span-1 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-on-surface-variant uppercase mb-1 block">Status</label>
                                <Status
                                    variant={task.status === 'done' ? 'online' : task.status === 'in-progress' ? 'degraded' : 'maintenance'}
                                    text={task.status.replace('-', ' ')}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-on-surface-variant uppercase mb-1 block">Assignee</label>
                                <div className="flex items-center gap-2 p-1.5 hover:bg-surface-variant/50 rounded cursor-pointer">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                        {task.assignee.charAt(0)}
                                    </div>
                                    <span className="text-sm text-on-surface">{task.assignee}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-on-surface-variant uppercase mb-1 block">Priority</label>
                                <div className="flex items-center gap-2 p-1.5 hover:bg-surface-variant/50 rounded cursor-pointer">
                                    <span className={clsx("w-2 h-2 rounded-full", {
                                        'bg-red-500': task.priority === 'high',
                                        'bg-yellow-500': task.priority === 'medium',
                                        'bg-blue-500': task.priority === 'low'
                                    })} />
                                    <span className="text-sm text-on-surface capitalize">{task.priority}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-on-surface-variant uppercase mb-2 block">Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {task.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded bg-surface-variant text-[11px] font-medium text-on-surface-variant">
                                            {tag}
                                        </span>
                                    ))}
                                    <button className="px-2 py-1 rounded hover:bg-surface-variant text-[11px] text-on-surface-variant">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-outline-variant space-y-2 text-xs text-on-surface-variant">
                            <p>Created just now</p>
                            <p>Updated 5 minutes ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
