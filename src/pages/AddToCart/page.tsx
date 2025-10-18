import styles from './AddToCart.module.scss';

export default function addToCart() {
    return (
        <main className={`page ${styles.atcPage}`}>
            <section className="textContainer">
                <h1 className="Title">Event</h1>
                <p className="fira">You are about to score some tickets to</p>
            </section>

        </main>
    )
}