import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@txnlab/use-wallet-react'
import { X, Zap, AlertCircle } from 'lucide-react'
import { Loop } from '../../stores/gameStore'
import { supabase } from '../../lib/supabase'

interface TicketPurchaseProps {
  loop: Loop
  onClose: () => void
  onPurchase?: (data: any) => void
}

export function TicketPurchase({ loop, onClose, onPurchase }: TicketPurchaseProps) {
  const { activeAddress, signTransactions, sendTransactions } = useWallet()
  const [ticketNumber, setTicketNumber] = useState('')
  const [amount, setAmount] = useState(loop.ticket_price.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAddress) return

    setIsSubmitting(true)
    setError('')

    try {
      // TODO: Implement actual transaction using algokit-utils
      // This is a placeholder for the smart contract interaction
      const purchaseData = {
        loop: loop.id,
        ticketNumber: parseInt(ticketNumber),
        amount: parseFloat(amount),
        wallet: activeAddress
      }

      console.log('Purchasing ticket:', purchaseData)

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Record purchase in Supabase
      const { error: insertError } = await supabase
        .from('loop_entries')
        .insert({
          loop_id: loop.id,
          wallet_address: activeAddress,
          ticket_number: parseInt(ticketNumber),
          amount_paid: parseFloat(amount),
          transaction_id: 'placeholder'
        })

      if (insertError) {
        throw insertError
      }

      setSuccess(true)

      // Call onPurchase callback if provided
      if (onPurchase) {
        onPurchase(purchaseData)
      }

      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (err) {
      setError('Failed to purchase ticket. Please try again.')
      console.error('Transaction error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enter Loop
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ticket Purchased!
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              You've entered the loop. Good luck!
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loop Info */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                {loop.name}
              </h4>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Difficulty: {loop.difficulty} • Prize: {loop.prize_pool} ALGO
              </div>
            </div>

            {/* Ticket Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose Your Lucky Number
              </label>
              <input
                type="number"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                min="1"
                max={loop.max_tickets}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={`1 - ${loop.max_tickets}`}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (ALGO)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={loop.ticket_price}
                step="0.001"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Minimum: {loop.ticket_price} ALGO
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !ticketNumber || !amount}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Purchase Ticket - ${amount} ALGO`
              )}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}