import { styled } from '@linaria/react';
import TickerPnLCard from '../components/TickerPnLCard';

export default function Home() {
    return (
        <HomeContainer>
            <Title>Ticker + PnL Card</Title>

            <CardsContainer>
                <TickerPnLCard symbol="BTC-PERP" side="long" entryPrice={67250} size={100} />
                <TickerPnLCard symbol="BTC-PERP" side="short" entryPrice={67250} size={50} />
            </CardsContainer>
        </HomeContainer>
    );
}

// Styled Components
// ----------------------

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    min-height: 100vh;
    padding: 48px 24px;
`;

const Title = styled.h1`
    margin: 0 0 32px 0;

    font-size: 32px;
    font-weight: 500;
    line-height: 1.2;
`;

const CardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;

    width: 100%;
    max-width: 400px;
`;
