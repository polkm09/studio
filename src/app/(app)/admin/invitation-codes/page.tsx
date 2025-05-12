"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_INVITATION_CODES, type InvitationCode } from "@/lib/types";
import { PlusCircle, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { format } from 'date-fns';

export default function ManageInvitationCodesPage() {
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [newCodeValue, setNewCodeValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCodes(MOCK_INVITATION_CODES);
  }, []);

  const handleGenerateCode = () => {
    if (!newCodeValue.trim()) {
      toast({ title: "Invalid Code", description: "Please enter a value for the new code.", variant: "destructive" });
      return;
    }
    const newCode: InvitationCode = {
      id: `code-${Date.now()}`,
      code: newCodeValue.trim().toUpperCase(),
      usedBy: null,
      createdAt: new Date().toISOString(),
      isValid: true,
    };
    setCodes(prevCodes => [newCode, ...prevCodes]);
    MOCK_INVITATION_CODES.unshift(newCode); // Update mock source
    toast({ title: "Code Generated", description: `New invitation code "${newCode.code}" has been added.` });
    setNewCodeValue('');
    setIsAddDialogOpen(false);
  };

  const handleDeleteCode = (codeId: string) => {
    setCodes(prevCodes => prevCodes.filter(code => code.id !== codeId));
    MOCK_INVITATION_CODES.splice(MOCK_INVITATION_CODES.findIndex(c => c.id === codeId), 1);
    toast({ title: "Code Deleted", description: `Invitation code has been removed.` });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Manage Invitation Codes</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Generate New Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate New Invitation Code</DialogTitle>
              <DialogDescription>
                Enter a unique string for the new invitation code. It will be converted to uppercase.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newCode" className="text-right">
                  Code Value
                </Label>
                <Input
                  id="newCode"
                  value={newCodeValue}
                  onChange={(e) => setNewCodeValue(e.target.value)}
                  className="col-span-3"
                  placeholder="E.g., SPECIAL25"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleGenerateCode}>Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Invitation Code List</CardTitle>
          <CardDescription>View, generate, and delete invitation codes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Used By (User ID)</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">No invitation codes found.</TableCell>
                </TableRow>
              )}
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono font-medium">{code.code}</TableCell>
                  <TableCell>
                    {code.isValid && !code.usedBy ? (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-red-600">
                        <XCircle className="w-3.5 h-3.5 mr-1.5" /> Used/Invalid
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{code.usedBy || 'N/A'}</TableCell>
                  <TableCell>{format(new Date(code.createdAt), "MMM d, yyyy 'at' h:mm a")}</TableCell>
                  <TableCell className="text-right">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Code</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the invitation code "{code.code}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCode(code.id)}
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
