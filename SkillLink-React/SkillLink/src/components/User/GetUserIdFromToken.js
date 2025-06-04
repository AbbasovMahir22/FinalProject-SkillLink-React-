export function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.nameid || payload.sub || null; // `nameid` ASP.NET Core Identity-də istifadə olunur
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
}