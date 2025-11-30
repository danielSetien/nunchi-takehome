'use client';

import { usePriceFeed } from '@/hooks/usePriceFeed';
import { pnlPct, pnlAbsFromPct } from '@/lib/pnl';
import { styled } from '@linaria/react';
import { useMemo } from 'react';

type TickerPnLCardProps = {
    symbol: string;
    side: 'long' | 'short';
    entryPrice: number;
    size?: number;
};

export default function TickerPnLCard({ symbol, side, entryPrice, size = 0 }: TickerPnLCardProps) {
    const { price, isPaused, togglePause } = usePriceFeed(symbol);

    const pnl = useMemo(() => {
        if (price === null) return { pct: 0, abs: 0 };
        const pct = pnlPct(side, entryPrice, price);
        const abs = size > 0 ? pnlAbsFromPct(pct, size) : 0;
        return { pct, abs };
    }, [price, side, entryPrice, size]);

    const isPositive = pnl.pct >= 0;

    return (
        <Card role="region" aria-label={`${symbol} ticker and PnL card`} $side={side}>
            <Header>
                <Symbol>{symbol}</Symbol>
                <Badge side={side} aria-label={`Position side: ${side}`}>
                    {side}
                </Badge>
            </Header>

            <PriceSection>
                <Label>Current Price</Label>
                <Price aria-live="polite" aria-atomic="true">
                    {price !== null ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Loading...'}
                </Price>
            </PriceSection>

            <PnLGrid>
                <PnLItem>
                    <Label>PnL %</Label>
                    <PnLValue
                        positive={isPositive}
                        aria-live="polite"
                        aria-label={`Profit and loss percentage: ${isPositive ? 'positive' : 'negative'} ${Math.abs(pnl.pct).toFixed(2)}%`}
                    >
                        {isPositive ? '+' : ''}
                        {pnl.pct.toFixed(2)}%
                    </PnLValue>
                </PnLItem>

                {size > 0 && (
                    <PnLItem>
                        <Label>PnL $</Label>
                        <PnLValue
                            positive={isPositive}
                            aria-live="polite"
                            aria-label={`Profit and loss in dollars: ${isPositive ? 'positive' : 'negative'} ${Math.abs(pnl.abs).toFixed(2)} dollars`}
                        >
                            {isPositive ? '+' : ''}${pnl.abs.toFixed(2)}
                        </PnLValue>
                    </PnLItem>
                )}
            </PnLGrid>

            <EntryPrice>Entry: ${entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</EntryPrice>

            <PauseButton onClick={togglePause} aria-label={isPaused ? 'Resume price updates' : 'Pause price updates'}>
                {isPaused ? 'Resume' : 'Pause'}
            </PauseButton>
        </Card>
    );
}

// Styled Components
// ----------------------

const Card = styled.div<{ $side: 'long' | 'short' }>`
    display: flex;
    flex-direction: column;
    gap: 16px;

    padding: 16px;
    width: 100%;
    max-width: 400px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;

    position: relative;
    color: var(--foreground);

    transition: border-color 0.15s ease;
    background: var(--surface);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    overflow: hidden;

    &::before {
        content: '';
        width: 300px;
        height: 300px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -200px;
        background: ${({ $side }) => ($side === 'long' ? `rgba(188, 216, 191, 0.603) 30%` : `rgba(214, 103, 226, 0.831)`)};
        filter: blur(120px);
        opacity: 0.4;
        pointer-events: none;
        z-index: -1;
        border-radius: 50%;
    }

    &:hover {
        border-color: var(--border-light);
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
`;

const Symbol = styled.h2`
    margin: 0;

    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;

    color: var(--text-primary);
`;

const Badge = styled.span<{ side: 'long' | 'short' }>`
    padding: 4px 12px;
    border-radius: 6px;

    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    background: ${(props) => (props.side === 'long' ? '#61F87814' : '#FF484B14')};
    color: ${(props) => (props.side === 'long' ? '#61F878' : '#FF484B')};
    border: 1px solid ${(props) => (props.side === 'long' ? '#61F87814' : 'transparent')};
`;

const PriceSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Label = styled.div`
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 1.4;
`;

const Price = styled.div`
    font-size: 32px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
    color: var(--text-primary);
`;

const PnLGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
`;

const PnLItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const PnLValue = styled.div<{ positive: boolean }>`
    font-size: 24px;
    font-weight: 500;
    color: ${(props) => (props.positive ? '#61F878' : '#FF484B')};
    font-variant-numeric: tabular-nums;
    line-height: 1.4;
`;

const EntryPrice = styled.div`
    font-size: 16px;
    font-weight: 400;
    line-height: 1.4;
    color: var(--text-secondary);
`;

const PauseButton = styled.button`
    padding: 11.5px 16px;
    border-radius: 8px;
    border: 1px solid var(--border-light);

    background: var(--surface);
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;

    cursor: pointer;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1.4;

    &:hover {
        background: #ffffff0f;
        border-color: var(--border-medium);
    }

    &:active {
        transform: scale(0.99);
    }

    &:focus-visible {
        outline: 2px solid #61f878;
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
        &:hover,
        &:active {
            transform: none;
        }
    }
`;
