import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";

export const useAuthStore= create((set)=>({
    authUser:null,

    // loading states
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    // to check if user is authenticated---- called every time user refreshes
    checkAuth: async()=>{
        try {
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});

        } catch (error) {
            console.log("Error in checkAuth: ",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    }

}));