import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CRMLayout from './Layout/CRMLayout'
import Dashboard from './Components/Dashboard'
import LeadsManager from './Components/LeadsManager'
import EventsManager from './Components/EventsManager'
import PaymentTracker from './Components/PaymentTracker'
import PhotographersManager from './Components/PhotographersManager'
import AttendanceTracker from './Components/AttendanceTracker'
import ExpensesManager from './Components/ExpensesManager'
import SalaryProcessor from './Components/SalaryProcessor'
import RemindersManager from './Components/RemindersManager'
import ContractGenerator from './Components/ContractGenerator'
import InvoiceGenerator from './Components/InvoiceGenerator'
import ProposalGenerator from './Components/ProposalGenerator'
import ScheduleCalendar from './Components/ScheduleCalendar'
import Settings from './Components/Settings'

const CRMApp = () => {
  return (
    <Routes>
      <Route path="/crm" element={<CRMLayout activeModule="dashboard"><Dashboard /></CRMLayout>} />
      <Route path="/crm/leads" element={<CRMLayout activeModule="leads"><LeadsManager /></CRMLayout>} />
      <Route path="/crm/events" element={<CRMLayout activeModule="events"><EventsManager /></CRMLayout>} />
      <Route path="/crm/payments" element={<CRMLayout activeModule="payments"><PaymentTracker /></CRMLayout>} />
      <Route path="/crm/photographers" element={<CRMLayout activeModule="photographers"><PhotographersManager /></CRMLayout>} />
      <Route path="/crm/attendance" element={<CRMLayout activeModule="attendance"><AttendanceTracker /></CRMLayout>} />
      <Route path="/crm/expenses" element={<CRMLayout activeModule="expenses"><ExpensesManager /></CRMLayout>} />
      <Route path="/crm/reminders" element={<CRMLayout activeModule="reminders"><RemindersManager /></CRMLayout>} />
      <Route path="/crm/salary" element={<CRMLayout activeModule="salary"><SalaryProcessor /></CRMLayout>} />
      <Route path="/crm/contracts" element={<CRMLayout activeModule="contracts"><ContractGenerator /></CRMLayout>} />
      <Route path="/crm/invoices" element={<CRMLayout activeModule="invoices"><InvoiceGenerator /></CRMLayout>} />
      <Route path="/crm/proposals" element={<CRMLayout activeModule="proposals"><ProposalGenerator /></CRMLayout>} />
      <Route path="/crm/calendar" element={<CRMLayout activeModule="calendar"><ScheduleCalendar /></CRMLayout>} />
      <Route path="/crm/settings" element={<CRMLayout activeModule="settings"><Settings /></CRMLayout>} />
    </Routes>
  )
}

export default CRMApp
