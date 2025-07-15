import { useEffect, useState } from "react";

/**
 * Um hook customizado que adia a atualização de um valor (debounce).
 * @param value O valor a ser "debounceado" (ex: texto de um input).
 * @param delay O tempo em milissegundos para esperar antes de atualizar.
 * @returns O valor "debounceado".
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;