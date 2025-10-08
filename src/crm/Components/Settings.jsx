import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSave, FaSync, FaCheckCircle, FaCog } from 'react-icons/fa'

const Settings = () => {
  const [scriptURL, setScriptURL] = useState(localStorage.getItem('https://script.google.com/macros/s/AKfycbyVdMPCmU-l81tx3ARuDxOfuaDrd6A3xK_hw9-jybdVZetf9z7wIYxQhe0vy2w2NA14jA/exec') || '')
  const [saved, setSaved] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const handleSave = () => {
    localStorage.setItem('GAS_SCRIPT_URL', scriptURL)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSync = async () => {
    setSyncing(true)
    // Simulate sync
    setTimeout(() => {
      setSyncing(false)
      alert('Data synced successfully!')
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h3 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-3">
          <FaCog className="text-gold" /> Google Sheets Integration
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              value={scriptURL}
              onChange={(e) => setScriptURL(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
            />
            <p className="text-sm text-gray-500 mt-2">
              Deploy your Google Apps Script as a web app and paste the URL here
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="bg-gold text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
            >
              {saved ? <FaCheckCircle /> : <FaSave />}
              {saved ? 'Saved!' : 'Save Settings'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSync}
              disabled={syncing}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <FaSync className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
      >
        <h4 className="text-lg font-bold text-blue-900 mb-4">Setup Instructions</h4>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Create a new Google Sheet</li>
          <li>Go to Extensions → Apps Script</li>
          <li>Paste the provided Google Apps Script code</li>
          <li>Deploy as Web App (Execute as: Me, Access: Anyone)</li>
          <li>Copy the deployment URL and paste above</li>
          <li>Click "Save Settings" and "Sync Now"</li>
        </ol>
      </motion.div>
    </div>
  )
}

export default Settings
