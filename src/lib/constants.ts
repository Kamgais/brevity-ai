import { isDev } from "./helpers";

export const PRICING_PLANS: Plan[] = [
    {
        id: 'basic',
        name: 'Basic',
        price: 9,
        items: [
            '5 PDF summaries per month',
            'Standard processing speed',
            'Email support'
        ],
        paymentLink: isDev ? 'https://buy.stripe.com/test_eVa7sL97adUW9WM8ww' : '',
        description: 'Perfect for occasional use',
        priceId: isDev ? 'price_1R7GsWRonfzmEgXKINhp68f1': ''
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 19,
        description: 'For professionals and teams',
        items: [
            'Unlimited PDF summaries',
            'Priority processing',
            '24/7 priority support',
            'Markdown Export'
        ],
        paymentLink: isDev ? 'https://buy.stripe.com/test_5kA9ATcjm3gi1qg6op' : '',
        priceId: isDev ? 'price_1R7Gx2RonfzmEgXK0mb3H73I': ''
    }
]


type Plan = {
    id: string;
    name: string;
    price: number;
    description: string;
    items: string[];
    paymentLink: string;
    priceId: string;
};