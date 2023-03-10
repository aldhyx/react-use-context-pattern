import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';

export default function createFastContext<Store>(initialStore: Store) {
    function UseStoreData(): {
        get: () => Store;
        set: (value: Partial<Store>) => void;
        subscribe: (callback: () => void) => () => void;
    } {
        const store = useRef(initialStore);

        const subscribers = useRef(new Set<() => void>());
        const get = useCallback(() => store.current, []);

        const set = useCallback((value: Partial<Store>) => {
            store.current = { ...store.current, ...value };
            subscribers.current.forEach((callback) => callback());
        }, []);

        const subscribe = useCallback((callback: () => void) => {
            subscribers.current.add(callback);

            return () => subscribers.current.delete(callback);
        }, []);

        return {
            get,
            set,
            subscribe,
        };
    }

    type UseStoreDataReturnType = ReturnType<typeof UseStoreData>;

    const StoreContext = createContext<UseStoreDataReturnType | null>(null);

    function Provider({ children }: { children: React.ReactNode }) {
        const value = UseStoreData();
        return (
            <StoreContext.Provider value={value}>
                {children}
            </StoreContext.Provider>
        );
    }

    function useStore<SelectorOutput>(
        selector: (store: Store) => SelectorOutput
    ): [SelectorOutput, (value: Partial<Store>) => void] {
        const store = useContext(StoreContext);
        if (!store) throw new Error('Store not found');

        // using new hooks
        // const state = useSyncExternalStore(store.subscribe, () =>
        //     selector(store.get())
        // );

        // using old hooks
        const [state, setState] = useState(selector(store.get()));

        useEffect(() => {
            return store.subscribe(() => setState(selector(store.get())));
        }, []);

        return [state, store.set];
    }
    return { Provider, useStore };
}
