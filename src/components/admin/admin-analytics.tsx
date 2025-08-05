
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartBar, RechartsPrimitive } from "@/components/ui/chart";
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { format, subDays, startOfDay } from 'date-fns';
import type { User, Event, ChatMessage } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const aggregateDataByDay = (items: { createdAt?: Timestamp }[] | { date: Timestamp }[] | { timestamp: Timestamp | null }[], dateKey: 'createdAt' | 'date' | 'timestamp') => {
    const dailyCounts: Record<string, number> = {};
    const today = startOfDay(new Date());

    for (let i = 29; i >= 0; i--) {
        const day = subDays(today, i);
        const dayStr = format(day, 'MMM d');
        dailyCounts[dayStr] = 0;
    }

    items.forEach(item => {
        // @ts-ignore
        const itemTimestamp = item[dateKey];
        if (itemTimestamp) {
            const itemDate = itemTimestamp.toDate();
            if (itemDate >= subDays(today, 29)) {
              const dayStr = format(itemDate, 'MMM d');
              if (dayStr in dailyCounts) {
                  dailyCounts[dayStr]++;
              }
            }
        }
    });

    return Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
};


export function AdminAnalytics() {
    const [users, setUsers] = useState<User[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map(doc => doc.data() as User));
        });
        const eventsUnsub = onSnapshot(collection(db, "events"), (snapshot) => {
            setEvents(snapshot.docs.map(doc => doc.data() as Event));
        });
        const messagesUnsub = onSnapshot(collection(db, "messages"), (snapshot) => {
            setMessages(snapshot.docs.map(doc => doc.data() as ChatMessage));
        });

        const timer = setTimeout(() => setLoading(false), 1000);

        return () => {
            usersUnsub();
            eventsUnsub();
            messagesUnsub();
            clearTimeout(timer);
        };
    }, []);

    const userChartData = aggregateDataByDay(users, 'createdAt');
    const eventChartData = aggregateDataByDay(events, 'date');
    const messageChartData = aggregateDataByDay(messages, 'timestamp');
    
    const chartConfig = {
        count: {
            label: "Count",
            color: "hsl(var(--primary))",
        },
    };

    if (loading) {
         return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>New Users</CardTitle>
                    <CardDescription>Sign-ups over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <RechartsPrimitive.BarChart data={userChartData}>
                           <RechartsPrimitive.XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.split(' ')[1]} interval={6} />
                           <RechartsPrimitive.YAxis domain={[0, 1000]} ticks={[0, 250, 500, 750, 1000]} />
                           <ChartTooltip content={<ChartTooltipContent />} />
                           <ChartBar dataKey="count" fill="var(--color-count)" radius={4} />
                        </RechartsPrimitive.BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Events Created</CardTitle>
                    <CardDescription>Events scheduled over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <RechartsPrimitive.BarChart data={eventChartData}>
                           <RechartsPrimitive.XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.split(' ')[1]} interval={6} />
                           <RechartsPrimitive.YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} />
                           <ChartTooltip content={<ChartTooltipContent />} />
                           <ChartBar dataKey="count" fill="var(--color-count)" radius={4} />
                        </RechartsPrimitive.BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Forum Activity</CardTitle>
                    <CardDescription>Messages posted over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                        <RechartsPrimitive.BarChart data={messageChartData}>
                           <RechartsPrimitive.XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.split(' ')[1]} interval={6} />
                           <RechartsPrimitive.YAxis domain={[0, 1000]} ticks={[0, 250, 500, 750, 1000]} />
                           <ChartTooltip content={<ChartTooltipContent />} />
                           <ChartBar dataKey="count" fill="var(--color-count)" radius={4} />
                        </RechartsPrimitive.BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
