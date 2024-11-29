import connectDB from '../../../models/dbConnect';
import restaurantinvoice from '../../../models/restaurantinvoice';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const invoices = await RestaurantInvoice.find();
        res.json(invoices);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
      break;
    case 'POST':
      try {
        const invoice = new RestaurantInvoice({
          invoiceno: req.body.invoiceno,
          date: req.body.date,
          time: req.body.time,
          custname: req.body.custname,
          totalamt: req.body.totalamt,
          gst: req.body.gst,
          payableamt: req.body.payableamt
        });
        const newInvoice = await invoice.save();
        res.status(201).json(newInvoice);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}