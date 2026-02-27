'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle, CheckCircle2, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BillerSchema } from '@/lib/biller-schemas'
import { PaymentMethod, PaymentMethodSelector } from './payment-method-selector'
import { FeeBreakdown } from './fee-breakdown'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

interface PaymentFormProps {
  schema: BillerSchema
}

export function PaymentForm({ schema }: PaymentFormProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [validatedAccount, setValidatedAccount] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  // 1. Generate dynamic Zod schema
  const formSchemaObject: any = {}
  schema.fields.forEach((field) => {
    let validator: any = z.string()
    if (field.validation.required) {
      validator = validator.min(1, field.validation.message || `${field.label} is required`)
    }
    if (field.validation.pattern) {
      validator = validator.regex(new RegExp(field.validation.pattern), field.validation.message)
    }
    formSchemaObject[field.name] = validator
  })

  const formSchema = z.object(formSchemaObject)
  type FormValues = z.infer<typeof formSchema>

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  // 2. Define parsedAmount (was missing)
  const amountField = schema.fields.find((f) => f.name === 'amount' || f.type === 'number')
  const amountValue = watch(amountField?.name as any)
  const parsedAmount = parseFloat(amountValue || '0')

  // 3. Logic: Account Validation
  const accountValue = watch(schema.fields[0].name as any)

  const validateAccount = async (value: string) => {
    setIsValidating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsValidating(false)
    const mockNames = ['John Doe', 'Sarah Williams', 'Emeka Azikiwe', 'Kofi Mensah']
    setValidatedAccount(mockNames[Math.floor(Math.random() * mockNames.length)])
  }

  useEffect(() => {
    if (accountValue && accountValue.length >= 10 && !errors[schema.fields[0].name]) {
      const delayDebounceFn = setTimeout(() => {
        validateAccount(accountValue)
      }, 1000)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setValidatedAccount(null)
    }
  }, [accountValue, errors[schema.fields[0].name]])

  // 4. Logic: Form Submission
  const onSubmit = async (data: FormValues) => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsProcessing(false)
    toast.success('Payment Successful!', {
      description: `Your payment to ${schema.name} has been processed.`,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-5">
        {schema.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>

            {field.type === 'select' ? (
              <Select onValueChange={(val: any) => setValue(field.name as any, val)}>
                <SelectTrigger className="h-12 rounded-2xl bg-muted/30 focus:ring-primary">
                  <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="relative">
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={cn(
                    'h-12 rounded-2xl bg-muted/30 focus:ring-primary',
                    isValidating && field.id === schema.fields[0].id && 'pr-10'
                  )}
                  {...register(field.name as any)}
                />
                {isValidating && field.id === schema.fields[0].id && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                )}
                {validatedAccount && field.id === schema.fields[0].id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs flex items-center gap-1.5 text-green-600 font-medium bg-green-50 p-2 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Account Verified: {validatedAccount}
                  </motion.div>
                )}
              </div>
            )}
            {errors[field.name] && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}

        <div className="pt-4">
          <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 bg-muted/20 p-4 rounded-2xl border border-border/50">
            <Checkbox id="saveDetails" className="rounded-lg" />
            <label
              htmlFor="saveDetails"
              className="text-sm font-medium cursor-pointer text-muted-foreground"
            >
              Save details for future payments
            </label>
          </div>

          <div className="space-y-4 border border-border/50 rounded-2xl p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Schedule for later</span>
              </div>
              <Checkbox
                id="schedule"
                checked={showSchedule}
                onCheckedChange={(checked: any) => setShowSchedule(!!checked)}
              />
            </div>

            <AnimatePresence>
              {showSchedule && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pt-2"
                >
                  <Input type="date" className="h-11 rounded-xl bg-card border-border" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {parsedAmount > 0 && (
          <div className="pt-4">
            <FeeBreakdown
              amount={parsedAmount}
              baseFee={schema.feeStructure.baseFee}
              percentageFee={schema.feeStructure.percentageFee}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          !isValid || isProcessing || (schema.fields[0].validation.required && !validatedAccount)
        }
        className="w-full h-14 rounded-2xl text-lg font-semibold"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Pay Now</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        )}
      </Button>
    </form>
  )
}
