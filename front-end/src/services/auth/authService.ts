import api from "@/services/api";

interface LoginData {
    email: string;
    senha: string;
}

interface LoginResponse {
    token: string;
}

interface RegisterData {
    nome: string;
    email: string;
    contato: string;
    senha: string;
}

interface UserProfile {
    role: "ADMIN" | "ARTISTA";
}

export const AuthService = {
    async login(data: LoginData) {
        const response =
            await api.post<LoginResponse>(
                "/auth/login",
                data
            );

        const { token } = response.data;

        localStorage.setItem(
            "token",
            token
        );

        const profile =
            await this.getProfile();

        localStorage.setItem(
            "userRole",
            profile.role
        );

        return profile.role;
    },

    async loginGoogle(
        googleToken: string
    ) {
        const response =
            await api.post<LoginResponse>(
                "/auth/login-google",
                {
                    token: googleToken,
                }
            );

        const { token } = response.data;

        localStorage.setItem(
            "token",
            token
        );

        const profile =
            await this.getProfile();

        localStorage.setItem(
            "userRole",
            profile.role
        );

        return profile.role;
    },

    async getProfile(): Promise<UserProfile> {
        const response =
            await api.get<UserProfile>(
                "/user/me"
            );

        return response.data;
    },

    logout() {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "userRole"
        );
    },

    isAuthenticated() {
        return !!localStorage.getItem(
            "token"
        );
    },

    async register(
        data: RegisterData
    ) {

        const response =
            await api.post(
                "/auth/register",
                data
            );

        return response.data;

    },

    getRole() {
        return localStorage.getItem(
            "userRole"
        ) as
            | "ADMIN"
            | "ARTISTA"
            | null;
    },

    registerGoogle(token: string) {
    return this.loginGoogle(token);
}
};