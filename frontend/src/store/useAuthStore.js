import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import {toast} from "react-hot-toast"
export const useAuthStore= create((set)=>({
    authUser:null,

    // loading states
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],

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
    },

    signup: async(data)=>{
        set({isSigningUp:true});
        try{
            console.log(data)
            const res = await axiosInstance.post("/auth/signup",data);
            //console.log("we got this from server :",res)
            set({authUser:res.data});
            toast.success("account created successfully");
        }
        catch(error){
            toast.error("Error in signup: ",error.response.data.message);
        }
        finally{
            set({isSigningUp:false});
        }
    },

}));