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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  loanType: z.string().min(1, "Please select a loan type"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a valid positive number",
  }),
  purpose: z.string().min(10, "Please provide a more detailed purpose for the loan"),
  employmentStatus: z.string().min(1, "Please select your employment status"),
  annualIncome: z.string().min(1, "Annual income is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Annual income must be a valid non-negative number",
  }),
  creditScore: z.string().min(1, "Credit score is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 300 && Number(val) <= 850, {
    message: "Credit score must be between 300 and 850",
  }),
});

const LoanRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoanTypeSelectOpen, setIsLoanTypeSelectOpen] = useState(false);
  const [isEmploymentStatusSelectOpen, setIsEmploymentStatusSelectOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanType: "",
      amount: "",
      purpose: "",
      employmentStatus: "",
      annualIncome: "",
      creditScore: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your backend
      console.log("Submitting loan request:", data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Loan request submitted successfully");
      // You might want to show a success message to the user here
      form.reset();
    } catch (error) {
      console.error("Error submitting loan request:", error);
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
          name="loanType"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Loan Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                onOpenChange={(open) => setIsLoanTypeSelectOpen(open)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="auto">Auto Loan</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="business">Business Loan</SelectItem>
                  <SelectItem value="student">Student Loan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={`space-y-6 transition-all duration-200 ${isLoanTypeSelectOpen ? 'opacity-50 blur-sm' : ''}`}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter loan amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Purpose</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the purpose of the loan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employmentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  onOpenChange={(open) => setIsEmploymentStatusSelectOpen(open)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fullTime">Full-time</SelectItem>
                    <SelectItem value="partTime">Part-time</SelectItem>
                    <SelectItem value="selfEmployed">Self-employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={`space-y-6 transition-all duration-200 ${isEmploymentStatusSelectOpen ? 'opacity-50 blur-sm' : ''}`}>
          <FormField
            control={form.control}
            name="annualIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Income</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your annual income" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Score</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your credit score" {...field} />
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
              Submitting Request...
            </>
          ) : (
            "Submit Loan Request"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoanRequestForm;

