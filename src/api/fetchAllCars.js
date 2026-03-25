import axiosInstance from "./axios"; // Adjust the path based on your project structure

export const fetchAllCars = async () => {
  try {
    const response = await axiosInstance.get("/view/cars"); // Replace '/view/cars' with your actual API endpoint
    return response.data; // Assuming the data is in response.data
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error; // Throwing the error to handle it in the calling component
  }
};