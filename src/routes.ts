import { Route } from "next"
import { useParams, useSearchParams } from "next/navigation"
import { z } from "zod"

type RouteWithParams<T extends string> = {
    get: (params: Record<string, string | number>) => Route<T>
    params: z.ZodSchema
}

type Locale = 'en' | 'fr' | 'de'
const LOCALES: Locale[] = ['en', 'fr', 'de']

export function useRouteParams<T extends string>(path: Route<T> | RouteWithParams<T>) {
    const params = useParams()
    if (typeof path === "object" && path.params) {
        const result = path.params.safeParse(params)
        if (!result.success) {
            throw new Error(`Invalid route params: ${result.error.message}`)
        }
        return result.data
    }
    return {}
}

export function useRouteSearchParams<T>(schema?: z.ZodSchema<T>): T extends undefined ? Record<string, never> : T {
    const searchParams = useSearchParams()
    if (schema) {
        const data = Object.fromEntries(searchParams.entries())
        const result = schema.safeParse(data)
        if (!result.success) {
            throw new Error(`Invalid search params: ${result.error.message}`)
        }
        return result.data as T extends undefined ? Record<string, never> : T
    }
    return {} as T extends undefined ? Record<string, never> : T
}

type RouteCreator<P = unknown, S = unknown> = {
    (params?: Record<string, string | number>, locale?: Locale): Route<string>
    useParams: () => P
    useSearchParams: () => S
}

export function createRoute<
    T extends string,
    P = Record<string, never>,
    S = Record<string, never>
>(
    path: Route<T> | RouteWithParams<T>,
    schema?: z.ZodSchema<S>
): RouteCreator<P, S> {
    const routeCreator = ((params?: Record<string, string | number>, locale: Locale = 'en') => {
        let routePath: string
        if (typeof path === "object") {
            if (!params) {
                throw new Error("Parameters are required for this route")
            }
            routePath = path.get(params)
        } else {
            routePath = path
        }
        // Add locale prefix to all routes except API routes
        if (!routePath.startsWith('/api/')) {
            routePath = `/${locale}${routePath}`
        }
        return routePath as Route<string>
    }) as RouteCreator<P, S>

    routeCreator.useParams = function useRouteParamsWrapper() {
        return useRouteParams(path) as P
    }
    routeCreator.useSearchParams = function useRouteSearchParamsWrapper() {
        return useRouteSearchParams(schema) as S
    }

    return routeCreator
}

export function createApiRoute(path: string, locale: string = 'en') {
    return `/${locale}${path}`
}

export const API_ROUTES = {
    companies: {
        base: (locale: string) => createApiRoute('/api/companies', locale),
        detail: (id: string, locale: string) => createApiRoute(`/api/companies/${id}`, locale),
    },
    investments: {
        base: (locale: string) => createApiRoute('/api/investments', locale),
        detail: (id: string, locale: string) => createApiRoute(`/api/investments/${id}`, locale),
    },
} as const

export const ROUTES = {
    route: createRoute("/"),
    auth: {
        login: {
            route: createRoute("/auth/login"),
        },
    },
    dashboard: {
        route: createRoute("/dashboard"),
    },
    companies: {
        route: createRoute("/companies"),
        list: createRoute(
            "/companies",
            z.object({
                status: z.enum(['ACTIVE', 'ACQUIRED', 'IPO', 'DEFUNCT']).optional(),
                sector: z.string().optional(),
            })
        ),
    },
    investments: {
        route: createRoute("/investments"),
        new: {
            route: createRoute("/investments/new"),
        },
        list: createRoute(
            "/investments",
            z.object({
                round: z.enum(['SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C']).optional(),
                year: z.string().optional(),
            })
        ),
    },
    reports: {
        route: createRoute("/reports"),
        performance: {
            route: createRoute("/reports/performance"),
        },
    },
} as const

/** * Routes that are accessible without authentication */
export const publicRoutes = [
    ROUTES.auth.login.route(),
]

/** * Routes used for authentication */
export const authRoutes = [
    ROUTES.auth.login.route(),
]

export const getPublicRoutes = (locale: Locale = 'en') => [
    ROUTES.auth.login.route({}, locale)
]

export const getAuthRoutes = (locale: Locale = 'en') => [
    ROUTES.auth.login.route({}, locale)
]

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = (locale: Locale = 'en') => 
    ROUTES.dashboard.route({}, locale)