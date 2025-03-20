"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { BankDropdown } from "./BankDropdown"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { createLocalTransfer,validateLocalTransfer } from "@/lib/actions/bank.actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import OTPVerificationModal from "./OTPVerificationModal"
import { useToast } from "../hook/useToast";

const USA_BANKS = [
  "Bank of America",
  "JPMorgan Chase",
  "Wells Fargo",
  "Citibank",
  "U.S. Bank",
  "PNC Bank",
  "Truist Bank",
  "TD Bank",
  "Capital One",
  "Goldman Sachs",
  "Fifth Third Bank",
  "Citizens Bank",
  "KeyBank",
  "Regions Bank",
  "M&T Bank",
  "Huntington National Bank",
  "HSBC Bank USA",
  "Ally Bank",
  "BMO Harris Bank",
  "Santander Bank",
  "First Republic Bank",
  "Discover Bank",
  "New York Community Bank",
  "First Citizens Bank",
  "Comerica Bank",
  "Silicon Valley Bank",
  "Signature Bank",
  "Synovus Bank",
  "First Horizon Bank",
  "Zions Bancorporation",
]

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Transfer note is too short"),
  amount: z.string().min(1, "Amount is too short"),
  senderBank: z.string().min(1, "Please select a valid bank account"),
  acct: z.string().min(10, "Please enter a valid account number"),
  routing: z.string().min(9, "Please enter a valid routing number"),
  receiverBank: z.string().min(1, "Please enter the receiver's bank name"),
})

interface PaymentTransferFormProps {
  accounts: any[] // Replace 'any' with the actual type of your accounts data
}

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [currentTransferId, setCurrentTransferId] = useState<number | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      acct: "",
      routing: "",
      receiverBank: "",
    },
  })

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    try {
      const response = await createLocalTransfer({
        account: Number(data.senderBank),
        transaction_type: "DEBIT",
        amount: Number.parseFloat(data.amount),
        title: "local_transfer",
        description: data.name,
        // receiver_bank: data.receiverBank,
        // receiver_account: data.acct,
        // receiver_routing: data.routing,
        // receiver_email: data.email,
      });
      console.log("Transfer created:", response); // ✅ Debugging log

      setCurrentTransferId(response.transfer_id);
      setShowOTPModal(true);
      showToast({ title: "Transfer initiated", description: "Please verify with the OTP sent to your registered contact." });
    } catch (error) {
      if (error instanceof Error) {
        showToast({ title: "Error", description: error.message || "An unexpected error occurred." });
      } else {
        showToast({ title: "Error", description: "An unexpected error occurred." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSuccess = async () => {
    setShowOTPModal(false);
    form.reset();
    showToast({ title: "Transfer successful", description: "Your funds have been transferred successfully." });
    router.push("/");
  };


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
          <FormField
            control={form.control}
            name="senderBank"
            render={() => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-6 pt-5">
                  <div className="payment-transfer_form-content">
                    <FormLabel className="text-14 font-medium text-gray-700">Select Source Bank</FormLabel>
                    <FormDescription className="text-12 font-normal text-gray-600">
                      Select the bank account you want to transfer funds from
                    </FormDescription>
                  </div>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full" />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-6 pt-5">
                  <div className="payment-transfer_form-content">
                    <FormLabel className="text-14 font-medium text-gray-700">Transfer Note (Optional)</FormLabel>
                    <FormDescription className="text-12 font-normal text-gray-600">
                      Please provide any additional information or instructions related to the transfer
                    </FormDescription>
                  </div>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Textarea placeholder="Write a short note here" className="input-class" {...field} />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="payment-transfer_form-details">
            <h2 className="text-18 font-semibold text-gray-900">Bank account details</h2>
            <p className="text-16 font-normal text-gray-600">Enter the bank account details of the recipient</p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item py-5">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Recipient&apos;s Email Address
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="ex: johndoe@gmail.com" className="input-class" {...field} />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiverBank"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-5 pt-6">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Receiver's bank name
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="input-class">
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-sm bg-white/90 border border-gray-200">
                          {USA_BANKS.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acct"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-5 pt-6">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Receiver&apos;s account number
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="Enter the account number" className="input-class" {...field} />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="routing"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-5 pt-6">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Receiver&apos;s routing number
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="Enter the routing number" className="input-class" {...field} />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />

        

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="border-y border-gray-200">
                <div className="payment-transfer_form-item py-5">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">Amount</FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input placeholder="ex: 5.00" className="input-class" {...field} />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="payment-transfer_btn-box">
            <Button type="submit" className="payment-transfer_btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Initiating Transfer...
                </>
              ) : (
                "Transfer Funds"
              )}
            </Button>
          </div>
        </form>
      </Form>
      {currentTransferId && (
        <OTPVerificationModal isOpen={showOTPModal} onClose={() => setShowOTPModal(false)} transferId={currentTransferId} onSuccess={handleOTPSuccess} />
      )}
    </>
  )
}

export default PaymentTransferForm

