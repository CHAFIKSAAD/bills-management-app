import { useEffect, useState } from "react";

function GlobalLoader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoading = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      setLoading(customEvent.detail);
    };

    window.addEventListener("global-loading", handleLoading);

    return () => {
      window.removeEventListener("global-loading", handleLoading);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="global-loader">
      <div className="global-loader-bar"></div>
    </div>
  );
}

export default GlobalLoader;
