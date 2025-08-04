
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Event } from '@/lib/types';
import { format } from 'date-fns';
import { Trash2, Edit } from 'lucide-react';

const mockEvents: Event[] = [
  { id: "1", title: "Intro to Linux Workshop", description: "Learn the basics of the Linux command line.", date: new Date(new Date().setDate(new Date().getDate() + 2))},
  { id: "2", title: "Python Scripting Session", description: "Automate tasks with Python scripts.", date: new Date(new Date().setDate(new Date().getDate() + 7))},
  { id: "3", title: "Guest Talk: DevOps with Kubernetes", description: "An industry expert shares insights.", date: new Date(new Date().setDate(new Date().getDate() + 7))},
  { id: "4", title: "Arch Linux Install Fest", description: "Install Arch Linux with help from experienced users.", date: new Date(new Date().setDate(new Date().getDate() + 15))},
];

export function EventManager() {
    const [events, setEvents] = useState<Event[]>(mockEvents);
    
    const handleDelete = (eventId: string) => {
        setEvents(events.filter(event => event.id !== eventId));
    };

    return (
        <div className="grid md:grid-cols-3 gap-8 mt-6">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Create Event</CardTitle>
                        <CardDescription>Add a new event to the calendar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input id="title" placeholder="e.g., Docker Workshop" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="A brief summary of the event." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date & Time</Label>
                            <Input id="date" type="datetime-local" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="link">Event Link (Optional)</Label>
                            <Input id="link" placeholder="https://example.com/event-details" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Create Event</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Events</CardTitle>
                        <CardDescription>Edit or delete existing events.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map(event => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell>{format(event.date, "PPpp")}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="mr-2">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
