import rateLimit from 'express-rate-limit';

export const aiDraftLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 2,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Alcanzaste el límite de generación por IA. Por favor, espera un minuto antes de volver a intentarlo.',
  },
});
