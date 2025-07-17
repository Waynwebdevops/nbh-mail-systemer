// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from 'zod';

const helloSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
});

export default function handler(req, res) {
  if (req.method === 'POST') {
    const result = helloSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    // Traitement normal
    return res.status(200).json({ message: `Bonjour, ${result.data.name}!` });
  }
  res.status(200).json({ name: 'John Doe' });
}
