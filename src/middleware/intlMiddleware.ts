import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { locales } from "../i18n";

const intlMiddlewareConfig = createMiddleware({
    locales,
    defaultLocale: "en",
    localePrefix: "always"
});

export const intlMiddleware = (req: NextRequest) => {
    return intlMiddlewareConfig(req);
};