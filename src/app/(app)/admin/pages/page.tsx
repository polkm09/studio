"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_HTML_PAGES, type HtmlPage } from "@/lib/types";
import { Trash2, ExternalLink } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManagePagesPage() {
  const [pages, setPages] = useState<HtmlPage[]>([]);
  const { toast } = useToast();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setPages(MOCK_HTML_PAGES);
    setBaseUrl(window.location.origin);
  }, []);

  const handleDeletePage = (pageId: string) => {
    setPages(prevPages => prevPages.filter(page => page.id !== pageId));
    MOCK_HTML_PAGES.splice(MOCK_HTML_PAGES.findIndex(p => p.id === pageId), 1);
    toast({ title: "Page Deleted", description: `Published page ${pageId} has been removed.` });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Manage Published Pages</h1>
      <Card>
        <CardHeader>
          <CardTitle>Published Pages List</CardTitle>
          <CardDescription>View and manage all pages published by users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page ID</TableHead>
                <TableHead>Creator Mobile</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Preview Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">No pages published yet.</TableCell>
                </TableRow>
              )}
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-mono font-medium truncate max-w-xs">{page.id}</TableCell>
                  <TableCell>{page.creatorMobile || 'N/A (Legacy)'}</TableCell>
                  <TableCell>{format(new Date(page.createdAt), "MMM d, yyyy 'at' h:mm a")}</TableCell>
                  <TableCell>
                    <Button variant="link" asChild className="p-0 h-auto">
                      <Link href={`${baseUrl}/view/${page.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        View Page <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Page</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the page with ID "{page.id}".
                              The public link will become a 404.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePage(page.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
