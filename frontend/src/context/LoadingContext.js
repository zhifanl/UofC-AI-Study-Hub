import { createContext } from "react"


const LoadingContext = createContext(
    {
        loading: false,
        setLoading: (status) => { }
    });

export default LoadingContext;