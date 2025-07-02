-- Insert sample loops for testing
-- This migration adds 4 active loops with different difficulty levels

INSERT INTO loops (name, difficulty, ticket_price, max_tickets, prize_pool, status) VALUES
    ('Bitcoin Price Prediction', 'EASY', 10, 100, 800, 'active'),
    ('Ethereum Network Activity', 'MEDIUM', 25, 50, 1000, 'active'),
    ('DeFi TVL Prediction', 'HARD', 50, 25, 1000, 'active'),
    ('Crypto Market Sentiment', 'EASY', 15, 80, 1000, 'active')
ON CONFLICT DO NOTHING; 