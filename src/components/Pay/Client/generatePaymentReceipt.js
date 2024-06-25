import { jsPDF } from 'jspdf';
import logoNetflix from '../../../assets/logoNetflix.png';

export const generatePaymentReceipt = ({
  description,
  transactionAmount,
  paymentMethodId,
  paymentTypeId,
  email,
  type,
  number,
}) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();


  const imgData = logoNetflix;
  const imgWidth = 40;
  const imgHeight = 20;
  const margin = 10;
  doc.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

  doc.setFontSize(20);
  const title = "Comprobante de Pago (formato de prueba)";
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 50);

  doc.setFontSize(12);
  doc.text(`Descripción: ${description}`, margin, 70);
  doc.text(`Monto: $ ${transactionAmount}`, margin, 80);
  doc.text('Datos del Pagador:', margin, 90);
  doc.text(`Email: ${email}`, margin, 100);
  doc.text(`${type}: ${number}`, margin, 110);
  doc.text(`Tarjeta de ${paymentTypeId === 'credit_card' ? 'Crédito' : 'Débito'} ${paymentMethodId === 'master' ? 'Master' : 'Visa'}`, margin, 120);
  doc.text('Estado: Aprobada', margin, 130);

  doc.save('comprobante_de_pago_netfilx_arrua.pdf');
};

export default generatePaymentReceipt;
