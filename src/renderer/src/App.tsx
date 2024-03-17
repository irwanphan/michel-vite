import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  const submitSalesDataHandler = (): void => window.electron.ipcRenderer.send('submit-sales-data')

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
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" 
            // onClick={submitSalesDataHandler}
            >
            Upload Sales Data
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
