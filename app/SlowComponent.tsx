export const SlowComponent = async () => {
    await new Promise((resolve) => setTimeout(resolve, 16000));
    return <p>I'm a slow component</p>;
};
