import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MainScreen = (): JSX.Element => {
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ statusMessage, setStatusMessage ] = useState('')

  // const getSalesDetailHandler = (): void => {
  //   setIsSubmitting(true)
  //   setStatusMessage(`getting sales detail ... `)
  //   window.electron.ipcRenderer.send('get-sales-detail')
  // }
  const submitSalesDetailHandler = (): void => {
    setIsSubmitting(true)
    setStatusMessage(`submitting sales detail ... `)
    window.electron.ipcRenderer.send('submit-sales-detail')
  } 
  const submitStockDetailHandler = (): void => {
    setIsSubmitting(true)
    setStatusMessage(`submitting stock detail ... `)
    window.electron.ipcRenderer.send('submit-stock-detail')
  }

  const navigate = useNavigate()

  // window.electron.ipcRenderer.on('get-sales-detail-reply', (_event, arg) => {
  //   setIsSubmitting(false)
  //   console.log('get-sales-detail-reply', arg);
  //   setStatusMessage(`getting sales detail ... ${arg.statusText}`)
  // });
  window.electron.ipcRenderer.on('submit-sales-detail-reply', (_event, arg) => {
    setIsSubmitting(false)
    console.log('submitted: ', arg.statusText);
    setStatusMessage(`submitting sales detail ... ${arg.statusText}`)
  });
  window.electron.ipcRenderer.on('submit-stock-detail-reply', (_event, arg) => {
    setIsSubmitting(false)
    console.log('submitted: ', arg.statusText);
    setStatusMessage(`submitting stock detail ... ${arg.statusText}`)
  });
  useEffect(() => {
    setStatusMessage('Initial load ... OK')
  }, [])
  useEffect(() => {
    if (!isSubmitting) {
      // window.electron.ipcRenderer.removeAllListeners('get-sales-detail-reply')
      window.electron.ipcRenderer.removeAllListeners('submit-sales-detail-reply')
      window.electron.ipcRenderer.removeAllListeners('submit-stock-detail-reply')
    }
  }, [isSubmitting])
  
  return (
    <>
      <h2>
        Custom Extension <span className="react">TokoPro</span>
        &nbsp;for <span className="ts">Michelin</span>
      </h2>
      <p className="tip">
        { statusMessage }
      </p>

      <div className="actions">
        <div className="action">
          <button onClick={() => navigate('config')}>
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

      <div id="data-container"></div>
    </>
  )
}

export default MainScreen
