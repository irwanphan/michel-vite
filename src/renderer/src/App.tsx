import { get } from 'http'
import SalesDetail from './components/SalesDetail'
import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'

const App = (): JSX.Element => {
  const submitSalesDetailHandler = (): void => window.electron.ipcRenderer.send('submit-sales-detail')
  const getSalesDetailHandler = (): void => window.electron.ipcRenderer.send('get-sales-detail')
  const submitStockDetailHandler = (): void => window.electron.ipcRenderer.send('submit-stock-detail')

  return (
    <>
      {/* <img alt="logo" className="logo" src={electronLogo} /> */}
      {/* <div className="creator">Powered by electron-vite</div> */}
      <div className="text">
        Custom Extension <span className="react">TokoPro</span>
        &nbsp;for <span className="ts">Michelin</span>
      </div>
      {/* <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p> */}

      <div className="actions">
        
        <div className="action">
          <a rel="noreferrer" 
            onClick={submitSalesDetailHandler}
            >
            Upload Sales Detail
          </a>
        </div>
        <div className="action">
          <a rel="noreferrer" 
            onClick={getSalesDetailHandler}
            >
            Get Sales Detail
          </a>
        </div>
        <div className="action">
          <a rel="noreferrer" 
            onClick={submitStockDetailHandler}
            >
            Upload Stock Detail
          </a>
        </div>
      </div>

      <SalesDetail />

      <Versions></Versions>
    </>
  )
}

export default App
