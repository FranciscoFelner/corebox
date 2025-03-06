import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from '../../styles/Checkout.module.css';

interface StripeCheckoutProps {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  amount,
  currency,
  description,
  metadata = {},
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Criar um Payment Intent no servidor
      const response = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar Payment Intent');
      }

      const { clientSecret } = await response.json();

      // Confirmar o pagamento com o Stripe.js
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message || 'Erro ao processar pagamento');
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        throw new Error(`Pagamento não concluído. Status: ${paymentIntent.status}`);
      }
    } catch (err: any) {
      setCardError(err.message);
      onError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.stripeCheckout}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="card-element">Cartão de Crédito ou Débito</label>
          <div className={styles.cardElementContainer}>
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
              onChange={(event) => {
                // @ts-ignore - Ignorando erro de tipagem do evento
                setCardError(event.error ? event.error.message : null);
              }}
            />
          </div>
          {cardError && <div className={styles.cardError}>{cardError}</div>}
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={styles.payButton}
        >
          {isProcessing ? 'Processando...' : `Pagar ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`}
        </button>
      </form>
    </div>
  );
};

export default StripeCheckout; 