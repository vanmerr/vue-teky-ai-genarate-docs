import axios from 'axios';

const baseUrl = 'https://us-central1-testjsonloop.cloudfunctions.net/app/api';
const services = {
    getCourses: async () => {
        try {
            const response = await axios.get(`${baseUrl}/courses`);
            return response.data; // Trả về dữ liệu lấy được từ API
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error; // Ném lỗi để phương thức gọi xử lý
        }
    },
    getLevels: async (courseId) => {
        try {
            const response = await axios.get(`${baseUrl}/levels?courseId=${courseId}`);
            return response.data; // Trả về dữ liệu lấy được từ API
        } catch (error) {
            console.error('Error fetching levels:', error);
            throw error; // Ném lỗi để phương thức gọi xử lý
        }
    },
    getLessons: async (courseId, levelId) => {
        try {
            const response = await axios.get(`${baseUrl}/lessons?courseId=${courseId}&levelId=${levelId}`);
            return response.data; // Trả về dữ liệu lấy được từ API
        } catch (error) {
            console.error('Error fetching lessons:', error);
            throw error; // Ném lỗi để phương thức gọi xử lý
        }
    },
    getCourse: async (courseId) => {
        try {
            const response = await axios.get(`${baseUrl}/courses/find?courseId=${courseId}`);
            return response.data; // Trả về dữ liệu lấy được từ API
        } catch (error) {
            console.error('Error fetching course:', error);
            throw error; // Ném lỗi để phương thức gọi xử lý
        }
    },
    getLevel: async (courseId, levelId) => {
        try {
            const response = await axios.get(`${baseUrl}/levels/find?courseId=${courseId}&levelId=${levelId}`);
            return response.data; // Trả về dữ liệu lấy được từ API
        } catch (error) {
            console.error('Error fetching level:', error);
            throw error; // Ném lỗi để phương thức gọi xử lý
        }
    },
    getLesson: async (courseId, levelId, lessonId) => {
        try {
            const response = await axios.get(`https://us-central1-testjsonloop.cloudfunctions.net/app/api/lessons/find?courseId=${courseId}&levelId=${levelId}&lessonId=${lessonId}`);
            return response.data; // Trả về dữ liệu lấy được từ API
        } catch (error) {
            console.error('Error fetching lesson:', error);
            throw error; // Ném lỗi để phương thức gọi xử lý
        }
    }

}

export default services;
