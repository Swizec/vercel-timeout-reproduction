export const SlowComponent = async () => {
    await new Promise((resolve) => setTimeout(resolve, 16000));
    return <p>Im a slow component</p>;
};
