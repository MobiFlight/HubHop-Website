import type { BrowserContext, Route } from "@playwright/test"
import { loadEnvConfig } from "@next/env"
import path from "path"
import { testUser } from "./auth"

loadEnvConfig(path.join(__dirname, "..", ".."))

const authority = (
  process.env.NEXT_PUBLIC_HUBHOP_OAUTH_AUTHORITY || ""
).replace(/\/$/, "")
const clientId = process.env.NEXT_PUBLIC_HUBHOP_OAUTH_CLIENTID || ""

const base64url = (value: string) => Buffer.from(value).toString("base64url")

/** An unsigned JWT; MSAL.js does not validate token signatures */
const unsignedJwt = (claims: Record<string, unknown>) =>
  `${base64url(JSON.stringify({ alg: "none", typ: "JWT" }))}.${base64url(JSON.stringify(claims))}.`

/**
 * A minimal OpenID Connect provider, mocking the login service (currently
 * Azure AD B2C) at the network level. The app's real MSAL login, token and
 * logout code runs against it: popup login, silent token refresh and logout.
 */
export class FakeIdentityProvider {
  private nonce = ""
  readonly user = {
    id: "00000000-0000-0000-0000-000000000001",
    tenant: "00000000-0000-0000-0000-0000000000aa",
    ...testUser,
  }

  async install(context: BrowserContext) {
    const origin = new URL(authority).origin
    await context.route(
      (url) => url.origin === origin,
      (route) => this.handle(route),
    )
  }

  private get endpoints() {
    return {
      issuer: `${authority}/v2.0/`,
      authorization_endpoint: `${authority}/oauth2/v2.0/authorize`,
      token_endpoint: `${authority}/oauth2/v2.0/token`,
      end_session_endpoint: `${authority}/oauth2/v2.0/logout`,
      jwks_uri: `${authority}/discovery/v2.0/keys`,
    }
  }

  private get clientInfo() {
    return base64url(
      JSON.stringify({ uid: this.user.id, utid: this.user.tenant }),
    )
  }

  private async handle(route: Route) {
    const request = route.request()
    const url = new URL(request.url())

    if (url.pathname.endsWith("/.well-known/openid-configuration")) {
      return route.fulfill({
        json: {
          ...this.endpoints,
          response_modes_supported: ["query", "fragment", "form_post"],
          response_types_supported: ["code", "id_token", "code id_token"],
          scopes_supported: ["openid", "offline_access"],
          subject_types_supported: ["pairwise"],
          id_token_signing_alg_values_supported: ["RS256"],
          token_endpoint_auth_methods_supported: ["client_secret_post"],
          claims_supported: ["name", "emails", "sub", "nonce", "tfp"],
        },
      })
    }

    if (url.pathname.endsWith("/oauth2/v2.0/authorize")) {
      const params = url.searchParams
      this.nonce = params.get("nonce") || ""
      const response = new URLSearchParams({
        code: "fake-authorization-code",
        state: params.get("state") || "",
        client_info: this.clientInfo,
      })
      const separator = params.get("response_mode") === "query" ? "?" : "#"
      return route.fulfill({
        status: 302,
        headers: {
          location: `${params.get("redirect_uri")}${separator}${response}`,
        },
      })
    }

    if (url.pathname.endsWith("/oauth2/v2.0/token")) {
      const body = new URLSearchParams(request.postData() || "")
      const now = Math.floor(Date.now() / 1000)
      const idToken = unsignedJwt({
        ver: "1.0",
        iss: this.endpoints.issuer,
        sub: this.user.id,
        oid: this.user.id,
        aud: clientId,
        iat: now,
        nbf: now,
        exp: now + 3600,
        auth_time: now,
        nonce:
          body.get("grant_type") === "authorization_code"
            ? this.nonce
            : undefined,
        name: this.user.name,
        emails: [this.user.username],
        preferred_username: this.user.username,
        tfp: authority.split("/").pop(),
      })
      return route.fulfill({
        json: {
          token_type: "Bearer",
          scope: body.get("scope") || "openid",
          expires_in: 3600,
          ext_expires_in: 3600,
          access_token: "fake-access-token",
          refresh_token: "fake-refresh-token",
          refresh_token_expires_in: 86400,
          id_token: idToken,
          id_token_expires_in: 3600,
          client_info: this.clientInfo,
        },
      })
    }

    if (url.pathname.endsWith("/oauth2/v2.0/logout")) {
      const target =
        url.searchParams.get("post_logout_redirect_uri") ||
        "http://localhost:3000/"
      return route.fulfill({ status: 302, headers: { location: target } })
    }

    return route.fulfill({ status: 404, body: `not mocked: ${url.pathname}` })
  }
}
