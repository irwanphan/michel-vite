import styles from './Config.module.css'
import { useNavigate } from 'react-router-dom'

const ConfigScreen = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.container}>
      <h2>Config! ⚙️</h2>

      <label className={styles.label}>
        Database Host: 
        <input className={styles.input} type="text" id="dbHost" placeholder="localhost" />
      </label>

      <label>
        Database Port: 
        <input className={styles.input} type="text" id="dbPort" placeholder="3306" />
      </label>

      <label>
        Database Username: 
        <input className={styles.input} type="text" id="dbUsername" placeholder="root" />
      </label>

      <label>
        Database Password: 
        <input className={styles.input} type="password" id="dbPassword" placeholder="password" />
      </label>

      <label>
        Database Name: 
        <input className={styles.input} type="text" id="dbName" placeholder="dbCompany" />
      </label>

      <div className={styles.buttonGroup}>
        <button onClick={() => navigate('/')}>Cancel</button>
        <button>Save</button>
      </div>
    </div>
  )
}

export default ConfigScreen