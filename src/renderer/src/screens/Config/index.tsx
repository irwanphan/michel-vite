import React, { useEffect, useState } from 'react'
import styles from './Config.module.css'
import { useNavigate } from 'react-router-dom'

type ConfigType = {
  dbHost: string,
  dbPort: string,
  dbUsername: string,
  dbPassword: string,
  dbName: string,
}

const ConfigScreen = () => {
  const navigate = useNavigate()
  const [ isLoading, setIsLoading ] = useState(false)
  const [ formData, setFormData ] = useState<ConfigType>({
    dbHost: '',
    dbPort: '',
    dbUsername: '',
    dbPassword: '',
    dbName: '',
  })

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true)
        window.electron.ipcRenderer.send('get-config')
      } catch (error) {
        console.error(error)
      }
    }
    fetchConfig()
  }, [])
  useEffect(() => {
    window.electron.ipcRenderer.removeAllListeners('get-config-reply')
    setIsLoading(false)
  }, [formData])

  window.electron.ipcRenderer.on('get-config-reply', (_event, arg) => {
    setFormData(arg)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handleSave = () => {
    window.electron.ipcRenderer.send('save-config', formData)
    navigate('/')
  }

  if (isLoading) {
    return <div>Loading ...</div>
  }

  return (
    <>
      <h2>
        <span className="react">TokoPro</span> Custom Extension
      </h2>
      <h3>Config! ⚙️</h3>

      <label className={styles.label}>
        Database Host: 
        <input className={styles.input} type="text" id="dbHost" placeholder="127.0.0.1" 
          onChange={handleChange}
          value={formData.dbHost}
      />
      </label>

      <label>
        Database Port: 
        <input className={styles.input} type="text" id="dbPort" placeholder="3306" 
          onChange={handleChange}
          value={formData.dbPort}
      />
      </label>

      <label>
        Database Username: 
        <input className={styles.input} type="text" id="dbUsername" placeholder="root" 
          onChange={handleChange}
          value={formData.dbUsername}
      />
      </label>

      <label>
        Database Password: 
        <input className={styles.input} type="password" id="dbPassword" placeholder="password" 
          onChange={handleChange}
          value={formData.dbPassword}
      />
      </label>

      <label>
        Database Name: 
        <input className={styles.input} type="text" id="dbName" placeholder="dbCompany" 
          onChange={handleChange}
          value={formData.dbName}
      />
      </label>

      <div className={styles.buttonGroup}>
        <button onClick={() => navigate('/')}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </>
  )
}

export default ConfigScreen