import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalculator, FaMoneyBillWave, FaDownload } from 'react-icons/fa'
import googleSheetsAPI from '../Utils/googleSheets'

const SalaryProcessor = () => {
  const [photographers, setPhotographers] = useState([])
  const [salaryData, setSalaryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    fetchData()
  }, [selectedMonth])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [photographersRes, salaryRes, attendanceRes] = await Promise.all([
        googleSheetsAPI.getPhotographers(),
        googleSheetsAPI.getSalaryData(),
        googleSheetsAPI.getAttendance()
      ])

      if (photographersRes.success) {
        const photographersWithSalary = photographersRes.data.map(photographer => {
          const attendance = attendanceRes.data.filter(
            a => a.photographerId === photographer.id && 
            a.date.startsWith(selectedMonth) && 
            a.status === 'Present'
          )
          const daysWorked = attendance.length
          const totalEarned = daysWorked * parseFloat(photographer.dailyRate || 0)
          
          const payments = salaryRes.data.filter(s => s.photographerId === photographer.id)
          const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
          const outstanding = totalEarned - totalPaid

          return {
            ...photographer,
            daysWorked,
            totalEarned,
            totalPaid,
            outstanding
          }
        })
        setPhotographers(photographersWithSalary)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const processSalaryPayment = async (photographerId, amount) => {
    try {
      await googleSheetsAPI.processSalary({
        photographerId,
        amount,
        date: new Date().toISOString().split('T')[0],
        month: selectedMonth
      })
      fetchData()
    } catch (error) {
      console.error('Error processing salary:', error)
    }
  }

  const totalSalaryExpense = photographers.reduce((sum, p) => sum + p.totalEarned, 0)
  const totalPaid = photographers.reduce((sum, p) => sum + p.totalPaid, 0)
  const totalOutstanding = photographers.reduce((sum, p) => sum + p.outstanding, 0)

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center gap-4">
        <label className="font-semibold text-charcoal">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-500 mb-2">Total Salary Expense</p>
          <h3 className="text-3xl font-bold text-blue-600">₹{totalSalaryExpense.toLocaleString()}</h3>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-500 mb-2">Total Paid</p>
          <h3 className="text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</h3>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-500 mb-2">Total Outstanding</p>
          <h3 className="text-3xl font-bold text-orange-600">₹{totalOutstanding.toLocaleString()}</h3>
        </motion.div>
      </div>

      {/* Salary Details Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Photographer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Days Worked</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Daily Rate</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Total Earned</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Paid</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-charcoal">Outstanding</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-charcoal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : photographers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">No data found</td>
                </tr>
              ) : (
                photographers.map((photographer, index) => (
                  <motion.tr
                    key={photographer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-bold">
                          {photographer.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-charcoal">{photographer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-charcoal">{photographer.daysWorked}</td>
                    <td className="px-6 py-4 text-gray-600">₹{parseFloat(photographer.dailyRate).toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">₹{photographer.totalEarned.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">₹{photographer.totalPaid.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-orange-600">₹{photographer.outstanding.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {photographer.outstanding > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const amount = prompt(`Enter amount to pay (Outstanding: ₹${photographer.outstanding}):`)
                            if (amount && !isNaN(amount)) {
                              processSalaryPayment(photographer.id, parseFloat(amount))
                            }
                          }}
                          className="bg-gold text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 flex items-center gap-2 ml-auto"
                        >
                          <FaMoneyBillWave /> Pay
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SalaryProcessor
