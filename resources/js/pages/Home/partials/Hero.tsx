import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t, i18n } = useTranslation();

    return (
        <section className="relative min-h-screen overflow-hidden">
            <h1>{t('dashboard')}</h1>
            <h1>{t('welcome')}</h1>
        </section>
    );
};

export default Hero;
