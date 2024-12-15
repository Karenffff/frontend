"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  billType: z.string().min(1, "Please select a bill type"),
  payee: z.string().min(2, "Payee name is too short"),
  accountNumber: z.string().min(5, "Account number is too short"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)), {
    message: "Amount must be a valid number",
  }),
  dueDate: z.string().min(1, "Due date is required"),
});

const PayBillsForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      billType: "",
      payee: "",
      accountNumber: "",
      amount: "",
      dueDate: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your backend
      console.log("Submitting bill payment:", data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Bill payment submitted successfully");
      // You might want to show a success message to the user here
      form.reset();
    } catch (error) {
      console.error("Error submitting bill payment:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="billType"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Bill Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                onOpenChange={(open) => setIsSelectOpen(open)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bill type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="utility">Utility</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="internet">Internet</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={`space-y-6 transition-all duration-200 ${isSelectOpen ? 'opacity-50 blur-sm' : ''}`}>
          <FormField
            control={form.control}
            name="payee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payee Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter payee name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Bill"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PayBillsForm;

