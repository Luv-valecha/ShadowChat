import { useEffect, useState } from "react";

const PWAInstallHelp = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-pwa-help", handler);
    return () => window.removeEventListener("open-pwa-help", handler);
  }, []);

  // 👇 Close on ESC key
  useEffect(() => {
    if (!open) return;

    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const isIOS = () =>
    /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  if (!open) return null;

  return (
    // 👇 Backdrop (click closes modal)
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={() => setOpen(false)}
    >
      {/* 👇 Modal (prevent backdrop click) */}
      <div
        className="bg-base-100 rounded-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold mb-3">Install ShadowChat</h3>

        {isIOS() ? (
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>Open this site in Safari</li>
            <li>Tap the <strong>Share</strong> icon</li>
            <li>Select <strong>Add to Home Screen</strong></li>
          </ol>
        ) : (
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>Open browser menu (⋮)</li>
            <li>Tap <strong>Add to Home Screen</strong></li>
            <li>Tap <strong>Install app</strong></li>
            <li>Confirm installation</li>
          </ol>
        )}

        <div className="mt-4 text-right">
          <button
            className="btn btn-sm"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallHelp;