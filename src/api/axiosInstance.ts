import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/shop/api/",  // Update this URL
    timeout: 10000,  // Optional: Set a timeout for requests
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export default axiosInstance;

