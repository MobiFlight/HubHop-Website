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
          Datenschutzerklärung für die Nutzung von Google Analytics
        </strong>
      </p>
      <p>
        Diese Website benutzt Google Analytics, einen Webanalysedienst der
        Google Inc. (&quot;Google&quot;). Google Analytics verwendet sog.
        &quot;Cookies&quot;, Textdateien, die auf Ihrem Computer gespeichert
        werden und die eine Analyse der Benutzung der Website durch Sie
        ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre
        Benutzung dieser Website werden in der Regel an einen Server von Google
        in den USA übertragen und dort gespeichert. Im Falle der Aktivierung der
        IP-Anonymisierung auf dieser Webseite wird Ihre IP-Adresse von Google
        jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in
        anderen Vertragsstaaten des Abkommens über den Europäischen
        Wirtschaftsraum zuvor gekürzt.
      </p>
      <p>
        Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von
        Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers
        dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung
        der Website auszuwerten, um Reports über die Websiteaktivitäten
        zusammenzustellen und um weitere mit der Websitenutzung und der
        Internetnutzung verbundene Dienstleistungen gegenüber dem
        Websitebetreiber zu erbringen. Die im Rahmen von Google Analytics von
        Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von
        Google zusammengeführt.
      </p>
      <p>
        Sie können die Speicherung der Cookies durch eine entsprechende
        Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch
        darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche
        Funktionen dieser Website vollumfänglich werden nutzen können. Sie
        können darüber hinaus die Erfassung der durch das Cookie erzeugten und
        auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an
        Google sowie die Verarbeitung dieser Daten durch Google verhindern,
        indem sie das unter dem folgenden Link verfügbare Browser-Plugin
        herunterladen und installieren:
        <a href="http://tools.google.com/dlpage/gaoptout?hl=de">
          http://tools.google.com/dlpage/gaoptout?hl=de
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
            href="http://www.google.com/intl/de/analytics/learn/privacy.html"
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
