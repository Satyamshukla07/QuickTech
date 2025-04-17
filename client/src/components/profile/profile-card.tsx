
import { useState } from "react";
import { User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProfileCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>
          Manage your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            {isEditing ? (
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            ) : (
              <p className="text-sm">{user?.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            {isEditing ? (
              <Input 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            ) : (
              <p className="text-sm">{user?.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            {isEditing ? (
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            ) : (
              <p className="text-sm">{user?.phone || "Not provided"}</p>
            )}
          </div>

          <div className="pt-4">
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
