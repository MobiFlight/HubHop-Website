import type { CookieConsentConfig } from "vanilla-cookieconsent"

/**
 * Cookie consent with vanilla-cookieconsent, as on mobiflight.com.
 *
 * HubHop uses its own cookie: mobiflight.com stores its choice in
 * `mf_cookie_consent` for the whole mobiflight.com domain, including
 * hubhop.mobiflight.com.
 */
export const CONSENT_COOKIE = "hubhop_cookie_consent"

/** Category that allows Google Tag Manager and Google Analytics */
export const ANALYTICS = "analytics"

const footer = (privacy: string, imprint: string) =>
  `<a href="/privacy/">${privacy}</a> · <a href="/terms/">${imprint}</a>`

export const cookieConsentConfig = (
  callbacks: Pick<CookieConsentConfig, "onConsent" | "onChange">,
): CookieConsentConfig => ({
  ...callbacks,
  cookie: { name: CONSENT_COOKIE, expiresAfterDays: 365 },
  // the page can't be used until the visitor chooses
  disablePageInteraction: true,
  guiOptions: {
    consentModal: {
      layout: "box",
      position: "middle center",
      equalWeightButtons: true,
    },
    preferencesModal: { layout: "box", equalWeightButtons: true },
  },
  categories: {
    necessary: { enabled: true, readOnly: true },
    // analytics cookies are deleted by revokeTagManager(), on all domains
    [ANALYTICS]: {},
  },
  language: {
    default: "en",
    autoDetect: "browser",
    translations: {
      en: {
        consentModal: {
          title: "We use cookies",
          description:
            "We'd like to use Google Analytics to understand how HubHop is used and to improve it. This sets cookies and sends usage data to Google, including to servers in the USA. Nothing is sent unless you agree. You can change your choice at any time via “Cookie settings” in the footer.",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage preferences",
          footer: footer("Privacy Policy", "Imprint"),
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          sections: [
            {
              description:
                'Choose which cookies you allow. You can change these settings at any time. More details in our <a href="/privacy/">Privacy Policy</a>.',
            },
            {
              title: "Strictly necessary",
              description:
                "Needed for HubHop to work: your login, settings, the preset cache and this cookie choice. They are stored in your browser and can't be switched off.",
              linkedCategory: "necessary",
            },
            {
              title: "Analytics",
              description:
                "Google Analytics (via Google Tag Manager) shows us how HubHop is used, e.g. which pages are visited. Data is sent to Google, including to servers in the USA.",
              linkedCategory: ANALYTICS,
            },
          ],
        },
      },
      de: {
        consentModal: {
          title: "Wir verwenden Cookies",
          description:
            "Wir möchten Google Analytics verwenden, um zu verstehen, wie HubHop genutzt wird, und es zu verbessern. Dabei werden Cookies gesetzt und Nutzungsdaten an Google übertragen, auch an Server in den USA. Ohne deine Zustimmung wird nichts übertragen. Du kannst deine Auswahl jederzeit über „Cookie-Einstellungen“ im Footer ändern.",
          acceptAllBtn: "Alle akzeptieren",
          acceptNecessaryBtn: "Alle ablehnen",
          showPreferencesBtn: "Einstellungen verwalten",
          footer: footer("Datenschutzerklärung", "Impressum"),
        },
        preferencesModal: {
          title: "Cookie-Einstellungen",
          acceptAllBtn: "Alle akzeptieren",
          acceptNecessaryBtn: "Alle ablehnen",
          savePreferencesBtn: "Auswahl speichern",
          closeIconLabel: "Schließen",
          sections: [
            {
              description:
                'Wähle aus, welche Cookies du erlaubst. Du kannst diese Einstellungen jederzeit ändern. Mehr dazu in unserer <a href="/privacy/">Datenschutzerklärung</a>.',
            },
            {
              title: "Unbedingt erforderlich",
              description:
                "Nötig, damit HubHop funktioniert: deine Anmeldung, Einstellungen, der Preset-Cache und diese Cookie-Auswahl. Sie werden in deinem Browser gespeichert und können nicht abgeschaltet werden.",
              linkedCategory: "necessary",
            },
            {
              title: "Statistik",
              description:
                "Google Analytics (über Google Tag Manager) zeigt uns, wie HubHop genutzt wird, z.B. welche Seiten aufgerufen werden. Dabei werden Daten an Google übertragen, auch an Server in den USA.",
              linkedCategory: ANALYTICS,
            },
          ],
        },
      },
      es: {
        consentModal: {
          title: "Usamos cookies",
          description:
            "Nos gustaría usar Google Analytics para entender cómo se utiliza HubHop y mejorarlo. Esto establece cookies y envía datos de uso a Google, también a servidores en EE. UU. No se envía nada sin tu consentimiento. Puedes cambiar tu elección en cualquier momento desde «Configuración de cookies» en el pie de página.",
          acceptAllBtn: "Aceptar todas",
          acceptNecessaryBtn: "Rechazar todas",
          showPreferencesBtn: "Gestionar preferencias",
          footer: footer("Política de privacidad", "Aviso legal"),
        },
        preferencesModal: {
          title: "Preferencias de cookies",
          acceptAllBtn: "Aceptar todas",
          acceptNecessaryBtn: "Rechazar todas",
          savePreferencesBtn: "Guardar preferencias",
          closeIconLabel: "Cerrar",
          sections: [
            {
              description:
                'Elige qué cookies permites. Puedes cambiar esta configuración en cualquier momento. Más información en nuestra <a href="/privacy/">Política de privacidad</a>.',
            },
            {
              title: "Estrictamente necesarias",
              description:
                "Necesarias para que HubHop funcione: tu inicio de sesión, la configuración, la caché de presets y esta elección de cookies. Se guardan en tu navegador y no se pueden desactivar.",
              linkedCategory: "necessary",
            },
            {
              title: "Analítica",
              description:
                "Google Analytics (a través de Google Tag Manager) nos muestra cómo se utiliza HubHop, p. ej. qué páginas se visitan. Los datos se envían a Google, también a servidores en EE. UU.",
              linkedCategory: ANALYTICS,
            },
          ],
        },
      },
    },
  },
})
