import React, { useEffect, useState } from 'react'
import styles from './Config.module.css'
import { useNavigate } from 'react-router-dom'

type ConfigType = {
  dbHost: string,
  dbPort: string,
  dbUsername: string,
  dbPassword: string,
  dbName: string,
  michelinUsername: string,
  michelinPassword: string,
  michelinSubcode: string,
  productionMode: boolean
}

const ConfigScreen = () => {
  const navigate = useNavigate()
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ formData, setFormData ] = useState<ConfigType>({
    dbHost: '',
    dbPort: '',
    dbUsername: '',
    dbPassword: '',
    dbName: '',
    michelinUsername: '',
    michelinPassword: '',
    michelinSubcode: '',
    productionMode: false
  })

  const fetchConfig = async () => {
    await window.electron.ipcRenderer.invoke('get-config')
      .then((res) => { if (res) setFormData(res) })
      .catch((error) => { console.error(error) })
      .finally(() => { 
        setIsLoading(false) 
        window.electron.ipcRenderer.removeAllListeners('get-config')
      })
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.checked
    })
  }

  const handleSave = async () => {
    await window.electron.ipcRenderer.invoke('save-config', formData)
      .then(() => navigate('/'))
      .catch((error) => { console.error(error) })
      .finally(() => { 
        setIsSubmitting(false) 
        window.electron.ipcRenderer.removeAllListeners('save-config')
      })
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
          disabled={isSubmitting}
          onChange={handleChange}
          value={formData.dbPort}
      />
      </label>

      <label>
        Database Username: 
        <input className={styles.input} type="text" id="dbUsername" placeholder="root" 
          disabled={isSubmitting}
          onChange={handleChange}
          value={formData.dbUsername}
        />
      </label>

      <label>
        Database Password: 
        <input className={styles.input} type="password" id="dbPassword" placeholder="password" 
          disabled={isSubmitting}
          onChange={handleChange}
          value={formData.dbPassword}
        />
      </label>

      <label>
        Database Name: 
        <input className={styles.input} type="text" id="dbName" placeholder="dbCompany" 
          disabled={isSubmitting}
          onChange={handleChange}
          value={formData.dbName}
        />
      </label>

      <hr className={styles.divider} />

      <label>
        Michelin Username: 
        <input className={styles.input} type="text" id="michelinUsername" placeholder="username" 
          disabled={isSubmitting}
          onChange={handleChange}
          value={formData.michelinUsername}
        />
      </label>

      <label>
        Michelin Password: 
        <input className={styles.input} type="password" id="michelinPassword" placeholder="password" 
          disabled={isSubmitting}
          onChange={handleChange}
          value={formData.michelinPassword}
        />
      </label>

      <label>
        Michelin Subcode: 
        <input className={styles.input} type="text" id="michelinSubcode" placeholder="subcode" 
          disabled={isSubmitting}
          onChange={handleChange}
          value={formData.michelinSubcode}
        />
      </label>

      {/* production */}
      <label>
        Turn On Production Mode:
        <input className={styles.inputCheck} type="checkbox" id="productionMode" 
          disabled={isSubmitting}
          onChange={handleCheckboxChange}
          checked={formData.productionMode}
        />
      </label>

      <p>
        <small>⚠️ Upon production mode, data will be send to Michelin. ⚠️</small>
      </p>
      <p>
        <small>⚠️ Only turn it on if you are sure about sending data. ⚠️</small>
      </p>

      <div className={styles.buttonGroup}>
        <button onClick={() => navigate('/')}
          disabled={isSubmitting}
          >Cancel</button>
        <button onClick={handleSave}
          disabled={isSubmitting}
          >Save</button>
      </div>
    </>
  )
}

export default ConfigScreen