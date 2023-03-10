import { useStore } from './App';

export default function TextInput({ value }: { value: 'first' | 'last' }) {
    const [fieldValue, setStore] = useStore((store) => store[value]);

    return (
        <div className="field">
            {value}:{' '}
            <input
                placeholder="input"
                type={'text'}
                value={fieldValue}
                onChange={(e) => setStore({ [value]: e.target.value })}
            />
        </div>
    );
}
