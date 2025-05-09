import axios from 'axios'

let host = import.meta.env.VITE_API_URL
const testAxios = axios.create({baseURL:host})

const getToken = () => {
    return new Promise((resolve, reject)=>{
        const temp_token = localStorage.getItem("token")
        if (temp_token)
            resolve(temp_token)
        reject(null)
    })
}

// Add a request interceptor
testAxios.interceptors.request.use(
    async config => {
        const token = await getToken()
        // console.log(token)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        config.headers['Access-Control-Allow-Origin'] = "*"
        if(config.headers['Content-Type'] !== 'multipart/form-data') 
            config.headers['Content-Type'] = 'application/json'
        return config
    },
    error => {
        Promise.reject(error)
    })

export default testAxios
