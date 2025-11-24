import { toast } from "react-hot-toast";

export const confirmToast = () =>
  new Promise((resolve) => {
    toast(
      <div className="text-gray-900">
        <p className="text-sm font-medium">Are you sure? Once deleted, your account cannot be recovered.</p>

        <div className="flex gap-3 mt-3 justify-end">
          <button
            className="px-3 py-1.5 rounded-md text-sm bg-gray-200 hover:bg-gray-300 transition"
            onClick={() => {
              resolve(false);
              toast.dismiss();
            }}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1.5 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
            onClick={() => {
              resolve(true);
              toast.dismiss();
            }}
          >
            Delete
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
        style: {
          padding: "16px",
          borderRadius: "10px",
          background: "#fff",
        },
      }
    );
  });
