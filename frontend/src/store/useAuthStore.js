import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast"
import { io } from "socket.io-client";
import { confirmToast } from "../lib/confirmToast.jsx";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,

    // loading states
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    // to check if user is authenticated---- called every time user refreshes
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();

        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            console.log(data)
            const res = await axiosInstance.post("/auth/signup", data);
            //console.log("we got this from server :",res)
            set({ authUser: res.data });
            toast.success("account created successfully");
            get().connectSocket();
        }
        catch (error) {
            toast.error("Error in signup: ", error);
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIng: true })
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({ isLoggingIng: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    deleteUser: async () => {
        const confirm = await confirmToast();
        if (confirm) {
            try {
                await axiosInstance.delete("/auth/delete");
                set({ authUser: null });
                toast.success("Profile Deleted successfully");
                get().disconnectSocket();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    },

    // for updating profile pic on profile page
    // data here is the profile pic to be updated with
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            // sending 'data->pic' to update-profile end point with a put request
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            // popup with success message
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in updating profile pic", error);
            // popup with error message
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }

}));