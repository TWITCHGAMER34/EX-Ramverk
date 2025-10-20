// typescript
// File: `src/pages/homepage/page.tsx`
import styles from './home.module.scss';
import Pager from "../../components/pager/Pager.tsx";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Mousewheel } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
    const { routes, index } = useSwipe();

    return (
        <Swiper
            modules={[Navigation, Pagination, Keyboard, Mousewheel]}
            spaceBetween={16}
            navigation
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true }}
            slidesPerView={1}
            className={`page ${styles.homePage}`}
            style={{ width: '100%', height: '100%' }}
        >
            <SwiperSlide>
                <header className={"hero"}>
                    <figure className={styles.imgContainer}>
                        <img src="/images/first_img.svg" alt="Party icon with confetti"/>
                    </figure>
                    <section className={"textContainer"}>
                        <h1 className={"Title"}>Where It´s @</h1>
                        <h2 className={"fira"}>Ticketing made easy</h2>
                    </section>
                </header>

                <section className={"pagerContainer"}>
                    <Pager count={routes.length} active={index} size={12} gap={16}/>
                </section>
            </SwiperSlide>
        </Swiper>
    );
}
