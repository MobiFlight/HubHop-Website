import Head from "next/head"
import Layout from "../components/Layout"

const Privacy = () => (
  <Layout title="Privacy Policy | Hubhop by Mobiflight">
    <Head>
      <meta name="title" content="Privacy Policy | Hubhop by Mobiflight" />
      <meta
        name="description"
        content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hubhop.mobiflight.com/privacy" />
      <meta
        property="og:title"
        content="Privacy Policy | Hubhop by Mobiflight"
      />
      <meta
        property="og:description"
        content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
      />
      <meta property="og:image" content="@/assets/logo-big.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:url"
        content="https://hubhop.mobiflight.com/privacy"
      />
      <meta
        property="twitter:title"
        content="Privacy Policy | Hubhop by Mobiflight"
      />
      <meta
        property="twitter:description"
        content="Get the preset for your favorite aircraft from Hubhop. The database is a community driven project. If you find events/variables of your favorite aircraft, please share them on Hubhop too."
      />
      <meta property="twitter:image" content="@/assets/logo-big.png" />
    </Head>
    <div className="container mx-auto mb-3 min-h-screen px-2 text-justify md:mt-10">
      <h1 className="mb-3 text-4xl">Datenschutzerklärung:</h1>
      <strong className="text-xl font-bold">Datenschutz</strong>
      <p>
        Die Nutzung unserer Webseite ist in der Regel ohne Angabe
        personenbezogener Daten möglich. Soweit auf unseren Seiten
        personenbezogene Daten (beispielsweise Name, Anschrift oder
        eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf
        freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche
        Zustimmung nicht an Dritte weitergegeben.
      </p>
      <p>
        Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei
        der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein
        lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht
        möglich.
      </p>
      <p>
        Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
        Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich
        angeforderter Werbung und Informationsmaterialien wird hiermit
        ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich
        ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von
        Werbeinformationen, etwa durch Spam-Mails, vor.
      </p>
      <p></p>
      <p>
        <strong className="text-xl font-bold">
          Datenschutzerklärung für die Nutzung von Google Tag Manager und Google
          Analytics
        </strong>
      </p>
      <p>
        Mit Ihrer Einwilligung nutzen wir Google Tag Manager und Google
        Analytics 4, Dienste der Google Ireland Limited, Gordon House, Barrow
        Street, Dublin 4, Irland (&quot;Google&quot;). Google Analytics hilft
        uns zu verstehen, wie HubHop genutzt wird (z.B. aufgerufene Seiten,
        Verweildauer, ungefähre Herkunft, Gerät und Browser), um die Website zu
        verbessern. Google Tag Manager lädt Google Analytics; er selbst setzt
        keine Cookies.
      </p>
      <p>
        Beide Dienste werden erst geladen, nachdem Sie im Cookie-Banner auf
        &quot;Accept&quot; geklickt haben. Vorher werden keine Daten an Google
        übertragen. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1
        lit. a DSGVO und § 25 Abs. 1 TDDDG. Werbefunktionen und Google Signals
        sind deaktiviert.
      </p>
      <p>
        Google Analytics speichert Cookies (&quot;_ga&quot; und
        &quot;_ga_&lt;ID&gt;&quot;) mit einer Laufzeit von bis zu zwei Jahren.
        Ihre IP-Adresse wird von Google Analytics 4 nicht gespeichert. Die Daten
        können an Google LLC in den USA übertragen werden. Google ist unter dem
        EU-US Data Privacy Framework zertifiziert; die USA verfügen damit über
        einen Angemessenheitsbeschluss der EU-Kommission.
      </p>
      <p>
        Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft
        widerrufen: Klicken Sie unten auf jeder Seite auf &quot;Cookie
        settings&quot; und wählen Sie &quot;Reject&quot;. Die Cookies von Google
        Analytics werden dann gelöscht. Weitere Informationen finden Sie in der
        Datenschutzerklärung von Google unter{" "}
        <a href="https://policies.google.com/privacy" target="_blank">
          https://policies.google.com/privacy
        </a>
        .
      </p>
      <p></p>
      <p>
        <em>
          Quellenangaben:
          <a
            rel="nofollow"
            href="http://www.e-recht24.de/muster-datenschutzerklaerung.html"
            target="_blank"
          >
            eRecht24
          </a>
          ,
          <a
            rel="nofollow"
            href="https://policies.google.com/privacy"
            target="_blank"
          >
            Datenschutzerklärung Google Analytics
          </a>
        </em>
      </p>
    </div>
  </Layout>
)

export default Privacy
