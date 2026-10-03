import axios from 'axios';

const baseUrl = '/api/activities';
const getAllActivities = () => axios.get(baseUrl).then(response => response.data);
const getNewActivity = () => axios.get(`${baseUrl}/new`).then(response => response.data);
const addActivity = activity => axios.post(baseUrl, activity).then(response => response.data);
const deleteAllActivities = () => axios.delete(baseUrl).then(response => response.data);
const activityService = { getAllActivities, getNewActivity, addActivity, deleteAllActivities };
export default activityService;
