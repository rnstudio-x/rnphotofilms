import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CRMHeader from './CRMHeader'
import CRMSidebar from './CRMSidebar'

// Import ALL components
import Dashboard from './Dashboard'
import LeadsManager from './LeadsManager'
import PaymentTracker from './PaymentTracker'
import EventsManager from './EventsManager'
import PhotographersManager from './PhotographersManager'
import AttendanceTracker from './AttendanceTracker'
import ExpensesManager from './ExpensesManager'
import SalaryProcessor from './SalaryProcessor'
import RemindersManager from '../Components/RemindersManager'
import ReportsAnalytics from './ReportsAnalytics'
import ContractGenerator from '../Components/ContractGenerator'
import Settings from './Settings'

const CRMLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <CRMSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <CRMHeader />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<LeadsManager />} />
            <Route path="/payments" element={<PaymentTracker />} />
            <Route path="/events" element={<EventsManager />} />
            <Route path="/photographers" element={<PhotographersManager />} />
            <Route path="/attendance" element={<AttendanceTracker />} />
            <Route path="/expenses" element={<ExpensesManager />} />
            <Route path="/salary" element={<SalaryProcessor />} />
            <Route path="/reminders" element={<RemindersManager />} />
            <Route path="/reports" element={<ReportsAnalytics />} />
            <Route path="/contracts" element={<ContractGenerator />} />
            <Route path="/invoices" element={<InvoiceGenerator />} />
            <Route path="/proposals" element={<ProposalGenerator />} />
            <Route path="/calendar" element={<ScheduleCalendar />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default CRMLayout
