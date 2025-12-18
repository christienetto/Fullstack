import { useEffect, useState } from "react"
import { getData } from "../functions/getdata"

export function Home() {
    const [ans, setAns] = useState(null)

    useEffect(() => {
        getData().then(data => setAns(data))
    }, [])

    return <div>{JSON.stringify(ans)}</div>
}
