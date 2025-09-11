
"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type UpcomingEvent = {
	 id: string;
	 name: string;
	 dateTime: string;
	 location: string;
	 description: string;
	 coverImage: string;
};

type PastEvent = {
	 id: string;
	 name: string;
	 date: string;
	 description?: string;
	 coverImage: string;
	 gallery: string[];
};

// No upcoming events currently
const upcomingEvents: UpcomingEvent[] = [];

const pastEvents: PastEvent[] = [
	{
		id: "pe1",
		name: "AI Talk with The Director of AI at DU",
		date: "8 September 2025",
		description: "Insider Knowledge: Hear directly from Mohammed Refai, Director of AI @ du. The Real Deal: Learn what GenAI and Agentic systems actually mean for your job prospects.",
		coverImage: "/images/e11.png",
		gallery: [
			"/images/e11.png",
			"/images/e1.png",
		],
	},
	{
		id: "pe2",
		name: "Leetcode Workshop",
		date: "10 September 2025",
		description: "Facing a tough technical interview? A hands-on workshop to master problem-solving and patterns used in coding interviews.",
		coverImage: "/images/e21.png",
		gallery: [
			"/images/e21.png",
			"/images/e2.png",
		],
	},
];

export default function EventsPage() {
	const [detailEventId, setDetailEventId] = useState<string | null>(null);
	const [galleryEventId, setGalleryEventId] = useState<string | null>(null);
	const [galleryIndex, setGalleryIndex] = useState<number>(0);

	const openGallery = (eventId: string, startIndex = 0) => {
		setGalleryEventId(eventId);
		setGalleryIndex(startIndex);
	};

	const closeGallery = () => {
		setGalleryEventId(null);
		setGalleryIndex(0);
	};

	const activeGallery = pastEvents.find((e) => e.id === galleryEventId);

	return (
		<div className="container py-12 md:py-20">
			<header className="text-center mb-12">
				<h1 className="text-4xl md:text-5xl font-headline font-bold">Events</h1>
				<p className="text-lg text-muted-foreground mt-2">Stay updated with our upcoming activities and explore highlights from our past events.</p>
			</header>

			<section aria-labelledby="upcoming-heading" className="space-y-6 mb-16">
				<div className="flex items-end justify-between flex-wrap gap-4">
					<h2 id="upcoming-heading" className="text-2xl md:text-3xl font-semibold">Upcoming Events</h2>
				</div>
				{upcomingEvents.length === 0 ? (
					<p className="text-muted-foreground">No upcoming events at the moment. Check back soon.</p>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{upcomingEvents.map((event) => (
							<Card key={event.id} className="overflow-hidden">
								<div className="relative h-40 w-full">
									<Image src={event.coverImage} alt={event.name} fill className="object-cover" />
								</div>
								<CardHeader>
									<CardTitle className="text-xl">{event.name}</CardTitle>
									<CardDescription>{event.dateTime} • {event.location}</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">{event.description}</p>
								</CardContent>
								<CardFooter className="justify-end">
									<Dialog open={detailEventId === event.id} onOpenChange={(open) => setDetailEventId(open ? event.id : null)}>
										<DialogTrigger asChild>
											<Button>Learn More</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>{event.name}</DialogTitle>
												<DialogDescription>{event.dateTime} • {event.location}</DialogDescription>
											</DialogHeader>
											<div className="space-y-4">
												<div className="relative h-48 w-full">
													<Image src={event.coverImage} alt={event.name} fill className="object-cover rounded" />
												</div>
												<p className="text-sm text-muted-foreground">{event.description}</p>
											</div>
											<DialogFooter>
												<Button onClick={() => setDetailEventId(null)}>Close</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</section>

			<section aria-labelledby="past-heading" className="space-y-6">
				<div className="flex items-end justify-between flex-wrap gap-4">
					<h2 id="past-heading" className="text-2xl md:text-3xl font-semibold">Past Events</h2>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{pastEvents.map((event) => (
						<Card key={event.id} className="overflow-hidden">
							<div className="relative h-40 w-full">
								<Image src={event.coverImage} alt={event.name} fill className="object-cover" />
							</div>
							<CardHeader>
								<CardTitle className="text-xl">{event.name}</CardTitle>
								<CardDescription>{event.date}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{event.description && (
									<p className="text-sm text-muted-foreground">{event.description}</p>
								)}
								<div className="grid grid-cols-3 gap-2">
									{event.gallery.slice(0, 3).map((src, idx) => (
										<button key={src} className="relative h-20 w-full overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-ring" onClick={() => openGallery(event.id, idx)} aria-label={`Open photo ${idx + 1} from ${event.name}`}>
											<Image src={src} alt={`${event.name} photo ${idx + 1}`} fill className="object-cover" />
										</button>
									))}
								</div>
							</CardContent>
							<CardFooter className="justify-end">
								<Button variant="secondary" onClick={() => openGallery(event.id)}>View More Photos</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</section>

			<Dialog open={!!activeGallery} onOpenChange={(open) => !open && closeGallery()}>
				<DialogContent className="max-w-3xl">
					<DialogHeader>
						<DialogTitle>{activeGallery?.name}</DialogTitle>
						<DialogDescription>{activeGallery?.date}</DialogDescription>
					</DialogHeader>
					{activeGallery && (
						<div className="space-y-4">
							<div className="relative w-full aspect-video">
								<Image src={activeGallery.gallery[galleryIndex]} alt={`${activeGallery.name} photo ${galleryIndex + 1}`} fill className="object-cover rounded" />
							</div>
							<div className="flex items-center justify-between">
								<Button variant="ghost" onClick={() => setGalleryIndex((i) => (activeGallery ? (i - 1 + activeGallery.gallery.length) % activeGallery.gallery.length : 0))}>Previous</Button>
								<div className="text-sm text-muted-foreground">{galleryIndex + 1} / {activeGallery.gallery.length}</div>
								<Button variant="ghost" onClick={() => setGalleryIndex((i) => (activeGallery ? (i + 1) % activeGallery.gallery.length : 0))}>Next</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
