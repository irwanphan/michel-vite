import { useEffect } from "react"

const SalesDetail = () => {
    useEffect(() => {
        console.log('renderer ready')
        window.electron.ipcRenderer.send('get-sales-detail')
    }, [])

    return (
        <div className="salesDetail">
            <p>
                Uploaded sales detail.
            </p>
        </div>
    )
}

export default SalesDetail