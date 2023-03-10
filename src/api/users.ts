import http, { ApiData } from './http';

export const getAppList = (): Promise<ApiData> => {
  return http.get('/apps');
}

export const addApp = (data: any): Promise<ApiData> => {
  return http.post('/apps', data)
}

export const removeApp = (id: number): Promise<ApiData> => {
  return http.delete(`/apps/${id}`)
}

export const getLabelList = (): Promise<ApiData> => {
  return http.get('/labels');
}

export const  register = (userInfo): Promise<ApiData> => {
  return http.post('/register', {
    ...userInfo 
  });
}