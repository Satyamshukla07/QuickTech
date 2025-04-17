
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function ReferralCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/auth?ref=${user?.referral_code}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy referral link",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refer & Earn</CardTitle>
        <CardDescription>
          Invite friends and earn rewards for each successful referral
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <code className="bg-background px-3 py-2 rounded flex-1">
                {user?.referral_code}
              </code>
              <Button variant="outline" onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Rewards Earned</p>
            <p className="text-2xl font-bold">₹{user?.referral_rewards || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
