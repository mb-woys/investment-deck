// middleware/utils.ts
export const testRoutesRegex = (routes: string[], pathname: string): boolean => {
    // Remove the locale prefix if it exists (e.g., /en/ or /fr/)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, '');

    return routes.some(route => {
        // Remove leading slash from route for comparison
        const cleanRoute = route.replace(/^\//, '');
        return pathWithoutLocale === cleanRoute ||
            pathWithoutLocale.startsWith(`${cleanRoute}/`);
    });
};