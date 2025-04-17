import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Order, Service } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import OrderStatusBadge from "@/components/order/order-status-badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "@/components/order/file-upload";
import { Loader2, FileText, AlertCircle, Clock, Search, Plus } from "lucide-react";

import ReferralCard from "@/components/referral/referral-card";
import ProfileCard from "@/components/profile/profile-card";


export default function DashboardPage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState("orders");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get service ID from query string if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("service");
    if (serviceId) {
      const id = parseInt(serviceId);
      if (!isNaN(id)) {
        setSelectedService(id);
        setIsOrderDialogOpen(true);
        setSelectedTab("new-order");
        // Remove the query parameter
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  // Fetch user's orders
  const { 
    data: orders, 
    isLoading: isOrdersLoading, 
    error: ordersError,
    refetch: refetchOrders
  } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Fetch all services
  const { 
    data: services, 
    isLoading: isServicesLoading, 
    error: servicesError 
  } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Find selected service details
  const selectedServiceDetails = selectedService ? 
    services?.find(service => service.id === selectedService) : null;

  // Handle file upload
  const handleFileChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (!selectedServiceDetails || uploadedFiles.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data
      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append("documents", file);
      });

      // Add order data
      const orderData = {
        service_id: selectedServiceDetails.id,
        total_amount: selectedServiceDetails.price,
        notes: orderNotes,
      };
      formData.append("orderData", JSON.stringify(orderData));

      // Submit order
      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Reset form and close dialog
      setUploadedFiles([]);
      setOrderNotes("");
      setSelectedService(null);
      setIsOrderDialogOpen(false);
      refetchOrders();
      setSelectedTab("orders");
    } catch (error) {
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Access Denied</CardTitle>
              <CardDescription className="text-center">
                You need to be logged in to view this page
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate("/auth")}>Login or Register</Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between mb-8 items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>

            <Button 
              onClick={() => {
                setSelectedTab("new-order");
                setIsOrderDialogOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Start New Order
            </Button>
          </div>

          <Tabs defaultValue="orders" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="new-order">New Order</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>
                    View and track the status of your document service orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isOrdersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : ordersError ? (
                    <div className="flex items-center justify-center py-8 text-red-500 gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <p>Error loading orders. Please try again.</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => {
                            const orderService = services?.find(s => s.id === order.service_id);
                            return (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id}</TableCell>
                                <TableCell>{orderService?.name || 'Unknown Service'}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <OrderStatusBadge status={order.status} />
                                </TableCell>
                                <TableCell>{order.payment_status}</TableCell>
                                <TableCell>₹{order.total_amount}</TableCell>
                                <TableCell>
                                  <Link href={`/orders/${order.id}`}>
                                    <Button variant="outline" size="sm">
                                      <FileText className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        You haven't placed any document processing orders yet. Start a new order to get your documents processed.
                      </p>
                      <Button onClick={() => setSelectedTab("new-order")}>
                        Start New Order
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="new-order">
              <Card>
                <CardHeader>
                  <CardTitle>Start New Order</CardTitle>
                  <CardDescription>
                    Choose a document service and upload your documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isServicesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : servicesError ? (
                    <div className="flex items-center justify-center py-8 text-red-500 gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <p>Error loading services. Please try again.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Service
                        </label>
                        <Select 
                          value={selectedService?.toString() || ""} 
                          onValueChange={(value) => setSelectedService(parseInt(value))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a document service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services?.map(service => (
                              <SelectItem key={service.id} value={service.id.toString()}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedServiceDetails && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium mb-2">{selectedServiceDetails.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{selectedServiceDetails.description}</p>
                          <div className="flex gap-3 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-primary mr-1" />
                              <span>{selectedServiceDetails.processing_time}</span>
                            </div>
                            <div>
                              <span className="font-medium">₹{selectedServiceDetails.price}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Required Documents
                        </label>
                        {selectedServiceDetails ? (
                          <div className="mb-3 text-sm bg-blue-50 p-3 rounded-md">
                            <p className="font-medium text-blue-800 mb-1">Required documents:</p>
                            <p className="text-blue-600">{selectedServiceDetails.requirements}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mb-3">
                            Select a service to see required documents
                          </p>
                        )}

                        <FileUpload
                          onFilesChange={handleFileChange}
                          files={uploadedFiles}
                          disabled={!selectedServiceDetails}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-3 h-24"
                          placeholder="Add any specific instructions or notes for processing your documents..."
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={handleSubmitOrder} 
                          className="w-full"
                          disabled={!selectedServiceDetails || uploadedFiles.length === 0 || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Order"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="referrals">
              <ReferralCard />
            </TabsContent>
            <TabsContent value="profile">
              <ProfileCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose a Service</DialogTitle>
            <DialogDescription>
              Select the document service you need assistance with
            </DialogDescription>
          </DialogHeader>

          {isServicesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                {services?.map(service => (
                  <div 
                    key={service.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedService === service.id ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-2">
                        <i className={`fas ${service.icon} text-sm`}></i>
                      </div>
                      <h4 className="font-medium">{service.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500">{service.description.substring(0, 60)}...</p>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-gray-600">₹{service.price}</span>
                      <span className="text-gray-600">{service.processing_time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsOrderDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsOrderDialogOpen(false);
                    setSelectedTab("new-order");
                  }}
                  disabled={!selectedService}
                >
                  Continue
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}