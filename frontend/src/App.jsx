import { useState } from 'react'
import axios from 'axios'
import './App.css'

const PRESET_FEELINGS = [
  'anxious',
  'stressed',
  'sad',
  'overwhelmed',
  'tired',
  'happy',
  'hopeful',
  'other'
]

function App() {
  const [name, setName] = useState('')
  const [feeling, setFeeling] = useState('')
  const [customFeeling, setCustomFeeling] = useState('')
  const [affirmation, setAffirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setAffirmation('')
    setLoading(true)

    if (!name.trim()) {
      setError('Please enter your name')
      setLoading(false)
      return
    }

    const actualFeeling = feeling === 'other' ? customFeeling : feeling
    if (!actualFeeling.trim()) {
      setError('Please tell us how you\'re feeling')
      setLoading(false)
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await axios.post(`${apiUrl}/api/affirmation`, {
        name: name.trim(),
        feeling: actualFeeling.trim()
      }, {
        timeout: 30000
      })

      setAffirmation(response.data.affirmation)
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.')
      } else if (err.response) {
        setError(err.response.data.detail || 'Something went wrong. Please try again.')
      } else if (err.request) {
        setError('Unable to connect to the server. Please check your connection.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Mood Architect</h1>
        <p className="subtitle">Your personalized therapeutic affirmation</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="feeling">How are you feeling?</label>
            <select
              id="feeling"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a feeling...</option>
              {PRESET_FEELINGS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {feeling === 'other' && (
            <div className="form-group">
              <label htmlFor="customFeeling">Describe your feeling</label>
              <input
                id="customFeeling"
                type="text"
                value={customFeeling}
                onChange={(e) => setCustomFeeling(e.target.value)}
                placeholder="Tell us more..."
                maxLength={500}
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : '✨Generate Affirmation'}
          </button>
        </form>

        {error && (
          <div className="message error">
            <strong>Oops!</strong> {error}
          </div>
        )}

        {affirmation && (
          <div className="message success">
            <p className="affirmation">{affirmation}</p>
          </div>
        )}

        <div className="footer">
          <small>Remember: This is not a substitute for professional mental health support.</small>
        </div>
      </div>
    </div>
  )
}

export default App