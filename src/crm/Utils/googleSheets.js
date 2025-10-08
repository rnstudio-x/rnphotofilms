// src/crm/utils/googleSheets.js

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVdMPCmU-l81tx3ARuDxOfuaDrd6A3xK_hw9-jybdVZetf9z7wIYxQhe0vy2w2NA14jA/exec' // Replace with your deployed GAS URL

class GoogleSheetsAPI {
  constructor() {
    this.scriptURL = SCRIPT_URL
  }

  // Generic fetch function
  async fetchData(action, data = {}) {
    try {
      const response = await fetch(this.scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Google Sheets API Error:', error)
      throw error
    }
  }

  // Leads Management
  async getLeads() {
    return this.fetchData('getLeads')
  }

  async addLead(leadData) {
    return this.fetchData('addLead', { lead: leadData })
  }

  async updateLead(leadId, leadData) {
    return this.fetchData('updateLead', { leadId, lead: leadData })
  }

  async deleteLead(leadId) {
    return this.fetchData('deleteLead', { leadId })
  }

  // Events Management
  async getEvents() {
    return this.fetchData('getEvents')
  }

  async addEvent(eventData) {
    return this.fetchData('addEvent', { event: eventData })
  }

  async updateEvent(eventId, eventData) {
    return this.fetchData('updateEvent', { eventId, event: eventData })
  }

  async deleteEvent(eventId) {
    return this.fetchData('deleteEvent', { eventId })
  }

  // Photographers Management
  async getPhotographers() {
    return this.fetchData('getPhotographers')
  }

  async addPhotographer(photographerData) {
    return this.fetchData('addPhotographer', { photographer: photographerData })
  }

  async updatePhotographer(photographerId, photographerData) {
    return this.fetchData('updatePhotographer', { photographerId, photographer: photographerData })
  }

  async deletePhotographer(photographerId) {
    return this.fetchData('deletePhotographer', { photographerId })
  }

  // Attendance Management
  async getAttendance(date = null) {
    return this.fetchData('getAttendance', { date })
  }

  async markAttendance(attendanceData) {
    return this.fetchData('markAttendance', { attendance: attendanceData })
  }

  // Expenses Management
  async getExpenses(startDate = null, endDate = null) {
    return this.fetchData('getExpenses', { startDate, endDate })
  }

  async addExpense(expenseData) {
    return this.fetchData('addExpense', { expense: expenseData })
  }

  async updateExpense(expenseId, expenseData) {
    return this.fetchData('updateExpense', { expenseId, expense: expenseData })
  }

  async deleteExpense(expenseId) {
    return this.fetchData('deleteExpense', { expenseId })
  }

  // Salary Management
  async getSalaryData(photographerId = null) {
    return this.fetchData('getSalaryData', { photographerId })
  }

  async processSalary(salaryData) {
    return this.fetchData('processSalary', { salary: salaryData })
  }

  // Analytics
  async getAnalytics(period = 'month') {
    return this.fetchData('getAnalytics', { period })
  }
}

export default new GoogleSheetsAPI()
