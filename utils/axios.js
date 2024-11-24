import axiosLib from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axios = axiosLib.create({
    baseURL: "http://papasavage.ru/api",
    headers: {
        "Content-Type": "application/json"
    }
});

axios.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('token', token);
    } catch (error) {
        console.error("Error saving token:", error);
    }
};

export default axios;