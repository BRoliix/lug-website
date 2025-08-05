
"use client";

import { useState, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { Loader2 } from 'lucide-react';
import { logActivity } from '@/lib/activity-logger';

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          text: data.text,
          user: data.user,
          avatarUrl: data.avatarUrl,
          timestamp: data.timestamp, // Can be null initially
          imageUrl: data.imageUrl,
        });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    const messageDoc = await addDoc(collection(db, "messages"), {
      text,
      user: user.displayName || 'You',
      avatarUrl: user.photoURL || 'https://placehold.co/40x40.png',
      timestamp: serverTimestamp(),
      clientTimestamp: Timestamp.now(),
    });
    await logActivity(user.uid, "Posted Message", `Sent a message in the forum. Message ID: ${messageDoc.id}`);
  };
  
  const handleImageUpload = async (imageDataUri: string) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    setUploading(true);
    
    const storageRef = ref(storage, `chat-images/${Date.now()}`);
    const uploadResult = await uploadString(storageRef, imageDataUri, 'data_url');
    const downloadURL = await getDownloadURL(uploadResult.ref);

    const messageDoc = await addDoc(collection(db, "messages"), {
      text: `Uploaded an image.`,
      user: user.displayName || 'You',
      avatarUrl: user.photoURL || 'https://placehold.co/40x40.png',
      timestamp: serverTimestamp(),
      clientTimestamp: Timestamp.now(),
      imageUrl: downloadURL,
    });
    
    await logActivity(user.uid, "Uploaded Image", `Uploaded an image to the forum. Message ID: ${messageDoc.id}`);
    setUploading(false);
  }

  return (
    <Card className="flex flex-col h-[70vh]">
      <CardHeader>
        <CardTitle>Forum Chat</CardTitle>
        <CardDescription>Real-time discussion with club members.</CardDescription>
      </CardHeader>
      <ChatMessages messages={messages} />
      {uploading && (
        <div className="flex items-center justify-center p-4 border-t">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Uploading...</span>
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} onImageSelect={handleImageUpload} disabled={uploading} />
    </Card>
  );
}
