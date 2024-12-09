import api from '../axiosInstance';



export const login = async (email: string, password: string) => {
    const response = await api.post('/login/', { email, password });
    return response.data;
  };
  
  export const getProfile = async (accessToken: string) => {
    const response = await api.get('/profile/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };
  
  export default api;