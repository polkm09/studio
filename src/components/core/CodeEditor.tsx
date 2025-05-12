"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Share2, Link as LinkIcon } from 'lucide-react';
import { MOCK_HTML_PAGES } from '@/lib/types'; // For mock page creation

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Ensure this runs only on the client side
    setBaseUrl(window.location.origin);
  }, []);


  const handleShipIt = async () => {
    if (!htmlCode.trim()) {
      toast({ title: "Empty Code", description: "Please paste some HTML code before shipping.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedLink('');

    // Simulate API call to save code
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Mock ID generation & storage
      const uniqueId = `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newPage = {
        id: uniqueId,
        htmlContent: htmlCode,
        createdAt: new Date().toISOString(),
        creatorId: 'current-user-id' // Should come from auth context
      };
      MOCK_HTML_PAGES.push(newPage); // Add to mock DB

      setGeneratedLink(`${baseUrl}/view/${uniqueId}`);
      toast({ title: "Page Published!", description: "Your HTML page is now live." });
      setHtmlCode(''); // Clear textarea after successful submission
    } catch (error) {
      toast({ title: "Error Publishing", description: (error as Error).message || "Could not publish your page.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
        .then(() => {
          toast({ title: "Copied!", description: "Link copied to clipboard." });
        })
        .catch(() => {
          toast({ title: "Copy Failed", description: "Could not copy link.", variant: "destructive" });
        });
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">HTML Playground</CardTitle>
        <CardDescription className="text-center">
          Paste your HTML code below and click "Ship It!" to generate a shareable page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="&lt;!-- Paste your HTML code here --&gt;"
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          className="min-h-[300px] font-mono text-sm bg-card border-input rounded-md shadow-sm focus:ring-primary focus:border-primary"
          aria-label="HTML Code Input"
        />
        <Button onClick={handleShipIt} className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="mr-2 h-4 w-4" />
          )}
          Ship It!
        </Button>
      </CardContent>
      {generatedLink && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline truncate"
              title={generatedLink}
            >
              {generatedLink}
            </a>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
            Copy Link
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CodeEditor;