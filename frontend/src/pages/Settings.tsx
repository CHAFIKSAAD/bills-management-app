import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type CompanySettings = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  defaultTva: string;
  currency: string;
};

const defaultSettings: CompanySettings = {
  companyName: "MASSMEDIA",
  tagline: "Impacting business",
  email: "contact@massmedia.ma",
  phone: "+212 6 00 00 00 00",
  address: "Casablanca, Maroc",
  city: "Casablanca",
  defaultTva: "20",
  currency: "DH",
};

function Settings() {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem("companySettings");

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings.companyName || !settings.email || !settings.phone) {
      toast.error("Veuillez remplir les informations principales");
      return;
    }

    localStorage.setItem("companySettings", JSON.stringify(settings));
    toast.success("Paramètres enregistrés avec succès");
  };

  const resetSettings = () => {
    localStorage.setItem("companySettings", JSON.stringify(defaultSettings));
    setSettings(defaultSettings);
    toast.success("Paramètres réinitialisés");
  };

  return (
    <div>
      <div className="card">
        <h3 style={{ margin: 0 }}>Paramètres Entreprise</h3>
        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Gérez les informations de l’entreprise utilisées dans les factures.
        </p>
      </div>

      <div className="settings-grid">
        <form onSubmit={saveSettings} className="card">
          <h3>Informations générales</h3>

          <div className="form-grid grid-2">
            <div>
              <label>Nom entreprise</label>
              <input
                value={settings.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="MASSMEDIA"
              />
            </div>

            <div>
              <label>Slogan</label>
              <input
                value={settings.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="Impacting business"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contact@massmedia.ma"
              />
            </div>

            <div>
              <label>Téléphone</label>
              <input
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+212 6 00 00 00 00"
              />
            </div>

            <div>
              <label>Adresse</label>
              <input
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Casablanca, Maroc"
              />
            </div>

            <div>
              <label>Ville</label>
              <input
                value={settings.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Casablanca"
              />
            </div>

            <div>
              <label>TVA par défaut (%)</label>
              <input
                type="number"
                value={settings.defaultTva}
                onChange={(e) => handleChange("defaultTva", e.target.value)}
                placeholder="20"
              />
            </div>

            <div>
              <label>Devise</label>
              <input
                value={settings.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                placeholder="DH"
              />
            </div>
          </div>

          <div style={{ marginTop: "18px", display: "flex", gap: "10px" }}>
            <button type="submit" className="primary-button">
              Enregistrer
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={resetSettings}
            >
              Réinitialiser
            </button>
          </div>
        </form>

        <div className="card settings-preview-card">
          <h3>Aperçu facture</h3>

          <div className="settings-company-preview">
            <img src="/massmedia-logo.jpg" alt="MASSMEDIA" />

            <div>
              <h2>{settings.companyName}</h2>
              <p>{settings.tagline}</p>
            </div>
          </div>

          <div className="settings-preview-list">
            <div>
              <span>Email</span>
              <strong>{settings.email}</strong>
            </div>

            <div>
              <span>Téléphone</span>
              <strong>{settings.phone}</strong>
            </div>

            <div>
              <span>Adresse</span>
              <strong>{settings.address}</strong>
            </div>

            <div>
              <span>TVA</span>
              <strong>{settings.defaultTva}%</strong>
            </div>

            <div>
              <span>Devise</span>
              <strong>{settings.currency}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
