// import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import SalesDetail from '../../components/SalesDetail'
// import Versions from '../../components/Versions'
// import { useWindowStore } from './store'
// import electronLogo from './assets/electron.svg'

const MainScreen = (): JSX.Element => {
  // const [ salesDetail, setSalesDetail ] = useState()
  // const [ isLoading, setIsLoading ] = useState(true)

  const submitSalesDetailHandler = (): void => window.electron.ipcRenderer.send('submit-sales-detail')
  // const getSalesDetailHandler = (): void => window.electron.ipcRenderer.send('get-sales-detail')
  const submitStockDetailHandler = (): void => window.electron.ipcRenderer.send('submit-stock-detail')

  const navigate = useNavigate()

  // window.electron.ipcRenderer.on('reply-sales-detail', (event, arg) => {
  //   console.log('reply-sales-detail', arg);
  //   setSalesDetail(arg);
  // });

  // useEffect(() => {

  // }, [salesDetail])
  
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

      <button onClick={() => navigate('config')}>
        Go to Config
      </button>

      <div className="actions">
        
        <div className="action">
          <a rel="noreferrer" 
            onClick={submitSalesDetailHandler}
            >
            Upload Sales Detail
          </a>
        </div>
        {/* <div className="action">
          <a rel="noreferrer" 
            onClick={getSalesDetailHandler}
            >
            Get Sales Detail
          </a>
        </div> */}
        <div className="action">
          <a rel="noreferrer" 
            onClick={submitStockDetailHandler}
            >
            Upload Stock Detail
          </a>
        </div>
      </div>

      <div id="data-container"></div>

      {/* <SalesDetail /> */}

      {/* <Versions></Versions> */}
    </>
  )
}

export default MainScreen
