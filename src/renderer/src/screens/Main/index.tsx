import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MainScreen = (): JSX.Element => {
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ statusMessage, setStatusMessage ] = useState('')
  const [ lastUpdates, setLastUpdates ] = useState({})

  // const getSalesDetailHandler = (): void => {
  //   setIsSubmitting(true)
  //   setStatusMessage(`getting sales detail ... `)
  //   window.electron.ipcRenderer.send('get-sales-detail')
  // }
  const submitSalesDetailHandler = async () => {
    try {
      setIsSubmitting(true)
      setStatusMessage(`submitting sales detail ... `)
      await window.electron.ipcRenderer.invoke('submit-sales-detail')
        .then((res) => {
          setStatusMessage(`submitting sales detail ... ${res.statusText}`)
          setLastUpdates({
            ...lastUpdates,
            lastSalesUpdate: res.lastSalesUpdate
          })
        })
    } catch (error: any) {
      console.error(error)
      setStatusMessage(`submitting sales detail ... ${error.message}`)
    } finally {
      setIsSubmitting(false)
      window.electron.ipcRenderer.removeAllListeners('submit-sales-detail-reply')
    }
  } 
  const submitStockDetailHandler = async () => {
    try {
      setIsSubmitting(true)
      setStatusMessage(`submitting stock detail ... `)
      await window.electron.ipcRenderer.invoke('submit-stock-detail')
        .then((res) => {
          setStatusMessage(`submitting stock detail ... ${res.statusText}`)
          setLastUpdates({
            ...lastUpdates,
            lastStockUpdate: res.lastStockUpdate
          })
        })
    } catch (error: any) {
      console.error(error)
      setStatusMessage(`submitting stock detail ... ${error.message}`)
    } finally {
      setIsSubmitting(false)
      window.electron.ipcRenderer.removeAllListeners('submit-stock-detail-reply')
    }
  }

  const navigate = useNavigate()

  // window.electron.ipcRenderer.on('get-sales-detail-reply', (_event, arg) => {
  //   setIsSubmitting(false)
  //   console.log('get-sales-detail-reply', arg);
  //   setStatusMessage(`getting sales detail ... ${arg.statusText}`)
  // });

  const getLastUpdates = async () => {
    await window.electron.ipcRenderer.invoke('get-last-updates')
      .then((res) => { setLastUpdates(res) })
      .catch((error) => { console.error(error) })
      .finally(() => { window.electron.ipcRenderer.send('get-last-updates') })
  }

  useEffect(() => {
    setStatusMessage('Initial load ... OK')
    getLastUpdates()
  }, [])
  
  return (
    <>
      <h2>
        <span className="react">TokoPro</span> Custom Extension
      </h2>
      <p className="tip">
        { statusMessage }
      </p>

      <div className="actions">
        <div className="action">
          <button onClick={() => navigate('config')}
            disabled={isSubmitting}
          >
            Go to Config
          </button>
        </div>
        {/* <div className="action">
          <button rel="noreferrer" onClick={getSalesDetailHandler}
            disabled={isSubmitting}
          >
            Get Sales Detail
          </button>
        </div> */}
      </div>

      <div className="actions">
        
        <div className="action">
          <button onClick={submitSalesDetailHandler}
            disabled={isSubmitting}
          >
            Upload Sales Detail
          </button>
        </div>
        
        <div className="action">
          <button rel="noreferrer" onClick={submitStockDetailHandler}
            disabled={isSubmitting}
          >
            Upload Stock Detail
          </button>
        </div>
      </div>

      <div>
        <h3>Last Updates</h3>
        <pre>
          { JSON.stringify(lastUpdates, null, 2) }
        </pre>
      </div>
    </>
  )
}

export default MainScreen
