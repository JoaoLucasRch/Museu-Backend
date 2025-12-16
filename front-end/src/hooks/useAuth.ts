// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';

// Este hook customizado encapsula a lógica de recuperação do token 
// do Local Storage.
export const useAuth = () => {
    // 1. Inicializa o estado lendo o token do Local Storage
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );

    // 2. Você pode adicionar um useEffect para ouvir mudanças no Local Storage
    // ou para realizar validações futuras do token, se necessário.
    
    // Por enquanto, ele apenas retorna o token
    return { token };
};