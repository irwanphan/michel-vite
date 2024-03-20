import { useEffect, useState } from "react"
import { ipcRenderer } from "electron"

const SalesDetail = () => {
    const [salesDetail, setSalesDetail] = useState<any>(null)
    const emittedSalesDetail = window.electron.ipcRenderer.on('sales-detail-emitted', (event, arg) => {
        console.log('arg', arg);
        setSalesDetail(arg)
    })
    // useEffect(() => {

    // }, [])

    return (
        <div className="salesDetail">
            <p>
                Uploaded sales detail.
                {salesDetail && 
                    // salesDetail.map((detail: any) => {
                    //     return (
                    //         <div key={detail.id}>
                    //             <p>{detail.id}</p>
                    //             <p>{detail.name}</p>
                    //             <p>{detail.price}</p>
                    //         </div>
                    //     )
                    // }
                    // )
                    <>asdf</>
                }
            </p>
        </div>
    )
}

export default SalesDetail