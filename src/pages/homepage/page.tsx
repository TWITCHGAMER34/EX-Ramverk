// src/pages/homepage/page.tsx
import styles from './home.module.scss';
import Pager from "../../components/pager/Pager.tsx";
import Swipeable from "../../components/swipe/Swipeable.tsx";
import { useSwipe } from '../../hooks/useSwipe.ts';

export default function HomePage() {
    const { routes, index } = useSwipe();

    return (
        <Swipeable className={`page ${styles.homePage}`}>
                <header className={"hero"}>
                    <figure className={styles.imgContainer}>
                        <img src="/images/first_img.svg" alt="Party icon with confetti"/>
                    </figure>
                    <section className={"textContainer"}>
                        <h1 className={"Title"}>Where It´s @</h1>
                        <h2 className={styles.fira}>Ticketing made easy</h2>
                    </section>
                </header>
                <section className={"pagerContainer"}>
                    <Pager count={routes.length} active={index} size={12} gap={16}/>
                </section>
        </Swipeable>
    );
}
