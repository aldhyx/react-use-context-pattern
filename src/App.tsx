import createFastContext from './createFastContext';
import TextInput from './TextInput';

export const { Provider, useStore } = createFastContext({
    first: 'john',
    last: 'doe',
});

const Display = ({ value }: { value: 'first' | 'last' }) => {
    const [fieldValue] = useStore((store) => store[value]);

    return (
        <div className="value">
            {value}: {fieldValue}
        </div>
    );
};

const FormContainer = () => {
    return (
        <div className="container">
            <h5>FormContainer</h5>
            <TextInput value="first" />
            <TextInput value="last" />
        </div>
    );
};

const DisplayContainer = () => {
    return (
        <div className="container">
            <h5>DisplayContainer</h5>
            <Display value="first" />
            <Display value="last" />
        </div>
    );
};

const ContentContainer = () => {
    const [fieldValue] = useStore((store) => store);
    console.log('🚀 ~ file: App.tsx:67 ~ App ~ fieldValue:', fieldValue);

    return (
        <div className="container">
            <h5>ContentContainer</h5>
            <FormContainer />
            <DisplayContainer />
        </div>
    );
};

function App() {
    return (
        <Provider>
            <div className="container">
                <h5>App</h5>
                <ContentContainer />
            </div>
        </Provider>
    );
}

export default App;
