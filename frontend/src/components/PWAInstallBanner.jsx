import { useEffect, useState } from "react";

const PwaInstallBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem("pwa-install-dismissed");
        if (!dismissed) setVisible(true);
    }, []);

    const dismiss = () => {
        localStorage.setItem("pwa-install-dismissed", "true");
        setVisible(false);
    };

    const isIOS = () =>
        /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    if (!visible) return null;

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 bg-base-100 border shadow-lg rounded-lg p-4 flex items-center gap-3">
                <span className="text-sm">
                    Install this app for a better experience 🚀
                </span>

                <button
                    onClick={() => window.dispatchEvent(new Event("open-pwa-help"))}
                    className="btn btn-sm btn-primary"
                >
                    How?
                </button>

                <button
                    onClick={dismiss}
                    className="btn btn-sm btn-ghost"
                >
                    ✕
                </button>
            </div>
        </>
    );
};

export default PwaInstallBanner;