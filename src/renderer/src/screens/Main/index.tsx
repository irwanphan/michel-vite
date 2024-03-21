import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import SalesDetail from '../../components/SalesDetail'
// import Versions from '../../components/Versions'

const MainScreen = (): JSX.Element => {
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ statusMessage, setStatusMessage ] = useState('')

  const submitSalesDetailHandler = (): void => {
    setIsSubmitting(true)
    setStatusMessage(`submitting sales detail ... `)
    window.electron.ipcRenderer.send('submit-sales-detail')
  } 
  const getSalesDetailHandler = (): void => {
    setIsSubmitting(true)
    setStatusMessage(`getting sales detail ... `)
    window.electron.ipcRenderer.send('get-sales-detail')
  }
  const submitStockDetailHandler = (): void => window.electron.ipcRenderer.send('submit-stock-detail')

  const navigate = useNavigate()

  window.electron.ipcRenderer.on('get-sales-detail-reply', (_event, arg) => {
    setIsSubmitting(false)
    console.log('get-sales-detail-reply', arg);
    setStatusMessage(`getting sales detail ... ${arg.statusText}`)
  });
  window.electron.ipcRenderer.on('submit-sales-detail-reply', (_event, arg) => {
    setIsSubmitting(false)
    console.log('submitted: ', arg.statusText);
    setStatusMessage(`submitting sales detail ... ${arg.statusText}`)
  });
  useEffect(() => {
    setStatusMessage('initial load ... OK')
  }, [])
  
  return (
    <>
      {/* <img alt="logo" className="logo" src={electronLogo} /> */}
      {/* <div className="creator">Powered by electron-vite</div> */}
      <div className="text">
        Custom Extension <span className="react">TokoPro</span>
        &nbsp;for <span className="ts">Michelin</span>
      </div>
      <p className="tip">
        { statusMessage }
      </p>

      <button onClick={() => navigate('config')}>
        Go to Config
      </button>

      <div className="actions">
        
        <div className="action">
          <button onClick={submitSalesDetailHandler}
            disabled={isSubmitting}
          >
            Upload Sales Detail
          </button>
        </div>
        <div className="action">
          <button rel="noreferrer" onClick={getSalesDetailHandler}
            disabled={isSubmitting}
          >
            Get Sales Detail
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

      <div id="data-container"></div>

      {/* <SalesDetail /> */}

      {/* <Versions></Versions> */}
    </>
  )
}

export default MainScreen
