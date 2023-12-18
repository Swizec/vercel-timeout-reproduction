export default function Home() {
    return (
        <main>
            This will timeout, but only when deployed 👇
            <br />
            Notice it stops streaming after 15s no matter what. Even in the
            middle of a sentence.
            <br />
            <br />
            <a href="/slowstreaming">start</a>
        </main>
    );
}
