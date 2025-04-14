import axios from 'axios'
import * as tunnel from 'tunnel'

let host = process.env.REACT_APP_API_URL
const agent = tunnel.httpsOverHttp({
    proxy: {
        host: 'http://localhost',
        port: 3001,
    },
})
const testAxios = axios.create({baseURL:host})


const getToken = () => {
    return new Promise((resolve, reject)=>{
        const temp_token = localStorage.getItem("userJwt")
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
