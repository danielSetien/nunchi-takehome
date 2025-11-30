type TickerPnLCardProps = {
    symbol: string;
    side: 'long' | 'short';
    entryPrice: number;
    size?: number;
};

export default function TickerPnLCard({ symbol, side, entryPrice, size }: TickerPnLCardProps) {
    return (
        <div>
            <h2>{symbol} Card</h2>
            <p>{side}</p>
            <p>{entryPrice}</p>
            <p>{size}</p>
        </div>
    );
}
